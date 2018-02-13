// ==UserScript==
// @name         Fetch Routes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get the route numbers along with their types
// @author       alalev
// @match        https://schedules.sofiatraffic.bg
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// ==/UserScript==

(function () {
   'use strict';

   const allData = [];
   let progressBar;

   let remaining = 0;
   let resolved = 0;

   let lastPercent = 0;

   function getStationNumber(routePointElement) {
      // NOTE alalev: 'stop_change' is the class of the station name
      return $(routePointElement).find('.stop_link').text().trim();
   }

   function analyzeSingle(link, type) {
      const href = window.location.href + $(link).attr('href');
      const numberMatch = href.match(/\/(\d+)$/);
      if (numberMatch === null) {
         remaining--;
         resolved++;
         $(link).css('color', 'red');
         console.error('Skipping route ' + href + ' (' + $(link).text() +
            ') because it has an invalid number');
         return;
      }
      const object = {
         routeNumber: parseInt(numberMatch[1]),
         vehicleType: type,
         _routePoints: [],
      };
      allData.push(object);
      $.get(href).then((result) => {
         const element = $($.parseHTML(result));
         const wrapper = $(element).find('.schedule_active_list_content')[0];
         const lists = $(wrapper).find('.schedule_direction_signs');

         if (lists.length > 2) {
            console.warn('Number of lists for ' + href + ' is ' + lists.length);
         }

         for (let i = 0; i < lists.length; i++) {
            const routePoints = $(lists[i]).find('li');
            const stations = [];
            for (let j = 0; j < routePoints.length; j++) {
               stations.push(getStationNumber(routePoints[j]));
            }
            object._routePoints.push(stations.join(','));
         }
         $(link).css('color', 'green');
      }).catch((err) => {
         console.error(err);
         console.error(href);
         object._routePoints = 'FAILURE!!!';
         $(link).css('color', 'red');
      }).always(() => {
         remaining--;
         resolved++;
         const newPercent = Math.round(resolved / (remaining + resolved) * 100);
         if (Math.abs(newPercent - lastPercent) > 8) {
            console.log('Progress: ' + newPercent + '%');
            lastPercent = newPercent;
         }
         $(progressBar).val(newPercent);
         $(progressBar).attr('max', 100);
         if (!remaining) {
            console.log(' -- DONE -- ');
            console.log(allData);
         }
      });
   }

   function analyze(linkContainerLabel, type) {
      const container = $('.lines_section:contains("' + linkContainerLabel + '")');
      if (container.length > 1) {
         throw new Error('More than one "' + linkContainerLabel + '" container found');
      }
      const links = $(container).find('a');
      remaining += links.length;

      for (let i = 0; i < links.length; i++) {
         analyzeSingle(links[i], type);
      }
   }

   $(() => {
      const contentBox = $('#content')[0];

      progressBar = document.createElement('progress');
      contentBox.appendChild(progressBar);
      $(progressBar).css('width', '100%');

      analyze('Трамвайни линии', 'tram');
      analyze('Тролейбусни линии', 'trolleybus');
      analyze('Градски автобусни линии', 'bus');
      analyze('Крайградски автобусни линии', 'bus');
   });
})();
