import { AnyInstance } from "../main/model";

export class SpecUtil {

   public static verifyInstance(instance: AnyInstance, attributes: any): void {
      expect(instance).toBeTruthy();
      for (const key in attributes) {
         expect(instance.get(key)).toBe(attributes[key]);
      }
   }

   public static verifyRawInstance(instance: { [attribute: string]: string }, attributes: any): void {
      expect(instance).toBeTruthy();
      for (const key in attributes) {
         expect(instance[key]).toBe(attributes[key]);
      }
   }

   public static destroy(...instances: AnyInstance[]): Promise<void[]> {
      return Promise.all(instances.map((instance: AnyInstance) => instance.destroy()));
   }
}
