import { Component, OnInit, OnDestroy } from '@angular/core';
import { Input } from '@angular/core';
import { ConductorArrival } from '../model/conductor-info';

@Component({
   selector: 'app-danger-indicator',
   templateUrl: './danger-indicator.component.html',
   styleUrls: ['./danger-indicator.component.css']
})
export class DangerIndicatorComponent implements OnInit, OnDestroy {
   @Input() arrivals: ConductorArrival[];

   private static readonly RESOLUTION: number = 300;
   private static readonly BLUR_SIZE: number = 6;
   private static readonly BLUR_PASSES: number = 3;
   private static readonly STAY_PER_MINUTE_CHANCE: number = 0.7;

   private static readonly TIMELINE_OFFSET_MS: number = -1 * 60 * 1000;
   private static readonly TIMELINE_LENGTH_MS: number = 5 * 60 * 1000;
   private static readonly TIMELINE_NOW_INDEX: number = Math.max(
      Math.round(DangerIndicatorComponent.RESOLUTION *
         (-DangerIndicatorComponent.TIMELINE_OFFSET_MS / DangerIndicatorComponent.TIMELINE_LENGTH_MS)),
      0
   );
   private static readonly STEP_SIZE_MS: number =
      DangerIndicatorComponent.TIMELINE_LENGTH_MS / DangerIndicatorComponent.RESOLUTION;

   chance: number = 0.0;
   private chances: number[];
   private refreshInterval: any;

   constructor() {
   }

   private calculateChances(): void {
      const now: number = new Date().getTime();
      const timelineBegin: number = now + DangerIndicatorComponent.TIMELINE_OFFSET_MS;
      const timelineEnd: number = timelineBegin + DangerIndicatorComponent.TIMELINE_LENGTH_MS;
      let time: number = timelineBegin;

      this.chances = [];
      for (let i: number = 0; i < DangerIndicatorComponent.RESOLUTION; i++) {
         this.chances.push(this.getChance(time));
         time += DangerIndicatorComponent.STEP_SIZE_MS;
      }

      this.chances = DangerIndicatorComponent.blur(this.chances,
         DangerIndicatorComponent.BLUR_PASSES);
   }

   private getChance(timestamp: number): number {
      let noConductorChance = 1.0;
      for (const arrival of this.arrivals) {
         if (arrival.arrivalTime > timestamp) {
            continue;
         }
         const elapsedTimeInMinutes: number = (timestamp - arrival.arrivalTime) / (60 * 1000);
         noConductorChance *= 1.0 - arrival.arrivalChance *
            Math.pow(DangerIndicatorComponent.STAY_PER_MINUTE_CHANCE, elapsedTimeInMinutes)
      }
      return 1.0 - noConductorChance;
   }

   // tslint:disable-next-line:member-ordering
   private static blur(array: number[], passes?: number): number[] {
      if (typeof passes === "undefined") {
         passes = 1;
      }
      if (!passes) {
         return array;
      }

      const result: number[] = [];
      for (let i: number = 0; i < array.length; i++) {
         let blurCount: number = 0;
         let current: number = 0;
         for (let j: number = Math.max(i - DangerIndicatorComponent.BLUR_SIZE, 0);
            j <= Math.min(i + DangerIndicatorComponent.BLUR_SIZE, array.length - 1); j++) {
            blurCount++;
            current += array[j];
         }
         result.push(current / blurCount);
      }
      return DangerIndicatorComponent.blur(result, passes - 1);
   }



   ngOnInit() {
      this.calculateChances();
      let index: number = DangerIndicatorComponent.TIMELINE_NOW_INDEX;
      this.chance = Number((this.chances[index] * 100).toFixed(2));

      console.log("Calling setInterval");
      this.refreshInterval = setInterval(() => {
         console.log("In setInterval");
         index++;

         if (index >= this.chances.length) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = undefined;
         } else {
            this.chance = Number((this.chances[index] * 100).toFixed(2));
         }
      }, DangerIndicatorComponent.STEP_SIZE_MS);
   }

   ngOnDestroy() {
      if (this.refreshInterval) {
         clearInterval(this.refreshInterval);
      }
   }
}
