import { ConnectionOptions } from "typeorm";
import { root } from "../config/root-path";
import { Observation } from "../entity/observation";

/**
 * Connection + entity config for sqlite DB
 */
export const sqliteOptions: ConnectionOptions = {
  type: "sqlite",
  database: `${root}/data/imported.sqlite`,
  entities: [Observation],
  // logging: true,
  synchronize: true,
};
