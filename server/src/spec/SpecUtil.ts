import { Promise } from "bluebird";
import { AnyInstance } from "../main/model";

export class SpecUtil {

   public static verifyInstance(instance: AnyInstance, attributes: any): void {
      for (const key in attributes) {
         expect(instance.get(key)).toBe(attributes[key]);
      }
   }

   public static destroy(...instances: AnyInstance[]): Promise<void> {
      return this.destroyInternal(instances, 0);
   }

   private static destroyInternal(instances: AnyInstance[],
      index: number): Promise<void> {

      return index >= instances.length
         ? Promise.resolve()
         : instances[index].destroy()
            .then((): Promise<void> => this.destroyInternal(instances, index + 1));
   }
}
