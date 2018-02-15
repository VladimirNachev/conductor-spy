export interface GeoLocation {
   longtitude: number;
   latitude: number;
}

export class MathUtil {
   private static readonly EARTH_RADIUS_EQUATOR_METERS: number = 6378 * 1000;
   private static readonly EARTH_RADIUS_POLE_METERS: number = 6356 * 1000;
   private static readonly CLOSENESS_TO_EQUATOR: number = 0.8;
   private static readonly EARTH_RADIUS_METERS: number =
      MathUtil.EARTH_RADIUS_EQUATOR_METERS * MathUtil.CLOSENESS_TO_EQUATOR +
      MathUtil.EARTH_RADIUS_POLE_METERS * (1.0 - MathUtil.CLOSENESS_TO_EQUATOR);

   public static kilometersPerHourToMetersPerSecond(kmph: number): number {
      return (kmph * 1000) / (60 * 60);
   }

   /**
    * Spherical law of cosines:
    *
    * Like in stations.json:
    * y1 = latitude 1
    * y2 = latitude 2
    * x1 = longtitude 1
    * x2 = longtitude 2
    *
    * distance = acos(sin(y1) * sin(y2) + cos(y1) * cos(y2) * cos(x2 - x1))*RADIUS
    * https://www.movable-type.co.uk/scripts/latlong.html
    */
   public static getDistanceInMeters(from: GeoLocation, to: GeoLocation): number {
      if (from.latitude === to.latitude && from.longtitude === to.longtitude) {
         return 0;
      }
      return MathUtil.EARTH_RADIUS_METERS * Math.acos(
         Math.sin(MathUtil.toRadians(from.latitude)) * Math.sin(MathUtil.toRadians(to.latitude)) +
         Math.cos(MathUtil.toRadians(from.latitude)) * Math.cos(MathUtil.toRadians(to.latitude)) *
         Math.cos(MathUtil.toRadians(to.longtitude - from.longtitude)));
   }

   private static toRadians(angle: number): number {
      return (angle / 180.0) * Math.PI;
   }
}
