

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


![Progress](http://progressed.io/bar/90?title=Server)
- Database (Sequelize & PostgreSQL)
   - [x] Routes - all the public transport routes - buses, trolleys, trams
      - id: integer
      - routeNumber: text/string (94, 102, 280, **44-Б**, etc.)
      - vehicleType: text/string ("Bus", "Trolleybus", "Tram")
   - [x] Stations - the places where the transport stops
       - id - integer
       - name - text/string
       - longtitude - double
       - latitude - double
       - conductorAt - bigint
   - [x] RoutePoints - the stations for each route
      - id - integer
      - routeId - integer
      - stationId - integer
      - index - integer
      - subrouteIndex - integer
   - [x] Edges
      - id: integer
      - fromStationId: integer
      - toStationId: integer
      - chance: double
      - travelTimeMs: integer (milliseconds)

![Progress](http://progressed.io/bar/100?title=Client)
- Client
    - Views
      - [x] Report
      - [x] Find
    - Services
      - [x] LocationService
      - [x] StationsService
