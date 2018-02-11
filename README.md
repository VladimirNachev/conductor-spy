[TOC]

# Conductor Spy

Want to warn the others?
--

See a conductor in the bus or on the station?
Let others know.

Looking for safety?
--

Travelling without a ticket? Check if there is a conductor to fine you.

The app
--

The app allows users to check where and when there are conductors in the public transport of Sofia and to warn the others if they spot one.

***

The technologies we use
---

- [Angular 2](https://angular.io)
- [NodeJS](https://nodejs.org/en/)
- [Sequelize](http://docs.sequelizejs.com)
- [Clarity](https://github.com/vmware/clarity)
- [Travis](https://travis-ci.org/)
- [Gulp](https://gulpjs.com/)

Our progress so far
---

Progress: Core/config
- Set DB(s) up
- TSLint
- Jasmine
- Travis CI


![Progress](http://progressed.io/bar/50?title=Server)
- Database (Sequelize & PostgreSQL)
   - [x] Routes - all the public transport routes - buses, trolleys, trams
      - id: integer
      - number: integer (94, 102, 280, ...)
      - type: text/string ("Bus", "Trolley", "Tram")
   - [x] Stations - the places where the transport stops
       - id - integer
       - name - text/string
       - location - (GPS coordinates)
       - conductorAt - integer
   - [x] RoutePoints - the stations for each route
      - id - integer
      - routeId - integer
      - stationId - integer
      - index - integer
      - isReversed - boolean
   - [x] Edges
      - id: integer
      - fromStationId: integer
      - toStationId: integer
      - chance: double
      - travelTimeMs: integer (milliseconds)

![Progress](http://progressed.io/bar/0?title=Client)
- Core? (http услугите, etc.)
   - [ ] DataService
- Common? (които се използват и за двете)
   - [ ] Route list
- Report? (записването на кондуктори)
   - [ ] ...
- Spot? (виждането на записани)
   - [ ] ...

![Progress](http://progressed.io/bar/50?title=UX/Design)
- Client
    - Core? (http услугите, etc.)
       - [ ] DataService
    - Common? (които се използват и за двете)
       - [ ] Route list
    - Report? (записването на кондуктори)
       - [ ] ...
    - Spot? (виждането на записани)
       - [ ] ...
