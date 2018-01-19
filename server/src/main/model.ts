import * as sequelize from "sequelize";
import { Instance } from "sequelize";

/**
 * All models that exist. This interface is necessary so that models can easily associate
 * with one another. It is important that the key of every model is the same as the name
 * of the model itself.
 *
 * The reason {@link AbstractModel} is used instead of concrete types is to avoid circular
 * dependencies.
 */
export interface ModelContainer {
   Station: AnyModel;
   Edge: AnyModel;
}

type AnyModel = sequelize.Model<any, any>;

/**
 * Attributes of a model that follows the conventions.
 */
export interface StandardAttributes {
   /** The ID of the instance */
   id?: number;
}

/**
 * Instance of a model that follows the conventions.
 */
export interface StandardInstance<TAttributes extends StandardAttributes> extends
   Instance<TAttributes> {

   /** The ID of the instance */
   id: number;
   /** When the instance was created */
   createdAt: Date;
   /** When the instance was last updated */
   updatedAt: Date;
}

export type AbstractModel = sequelize.Model<Instance<any>, any>;
export type AnyInstance = Instance<any>;