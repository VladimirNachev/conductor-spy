import { AnyInstance } from "../main/model";

interface RawInstance { [attribute: string]: string; }

export class SpecUtil {

   public static verifyInstance(instance: AnyInstance | RawInstance,
      attributes: any): void {

      expect(instance).toBeTruthy();
      if (!!(instance as AnyInstance).get) {
         for (const key in attributes) {
            expect((instance as AnyInstance).get(key)).toBe(attributes[key],
              `The '${key}' attribute should be correct`);
         }
      } else {
         for (const key in attributes) {
            expect((instance as RawInstance)[key]).toBe(attributes[key],
               `The '${key}' attribute should be correct`);
         }
      }
   }
}
