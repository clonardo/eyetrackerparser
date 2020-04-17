import { createConnection, Connection } from "typeorm";
import { sqliteOptions } from "../config/sqlite-conn.config";

let conn: Connection;

/**
 * Get a connection to sqlite
 */
export async function GetDbConnection(): Promise<Connection> {
  return new Promise<Connection>(async (resolve, reject) => {
    try {
      if (conn) {
        resolve(conn);
      } else {
        conn = await createConnection(sqliteOptions);
        resolve(conn);
      }
    } catch (err) {
      console.error("Unable to initialize DB connection: ", err);
      reject(err);
    }
  });
}
