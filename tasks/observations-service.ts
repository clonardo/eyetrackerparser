import { createConnection, Repository } from "typeorm";
import { Observation } from "../entity/observation";
import { sqliteOptions } from "../config/sqlite-conn.config";
import { writeFileSync } from "fs";
import { prepareRowsForDb } from "../utils/db-insert-utils";
import { CleanedDataRow } from "../contracts/cleaned-data-row";
import { GetDbConnection } from "./get-db-connection";
import { HashString, EventRowsGroup } from "../contracts";
import { getUniqueHashes } from "../utils/hashing-utils";
import { getDataRowsForEvent } from "../utils/event-rollup-utils";

/**
 * Get a connection and initialize the observation repository
 */
export async function GetObservationRepository(): Promise<
  Repository<Observation>
> {
  return new Promise<Repository<Observation>>(async (resolve, reject) => {
    try {
      const connection = await GetDbConnection();

      const repo = await connection.getRepository(Observation);

      resolve(repo);
    } catch (err) {
      console.error(
        "Unable to initialize observation repository DB connection: ",
        err
      );
      reject(err);
    }
  });
}

/**
 * Get count of all rows in Observations table
 */
export async function getObsRowCount(): Promise<number> {
  let res;
  let msg: string;
  let success = false;
  try {
    const observationRepository = await GetObservationRepository();
    // res = await observationRepository.save(rows, { chunk: 1000 });

    // extract row count because typeorm is dumb
    let tmp = await observationRepository.query(
      `SELECT COUNT(*) from Observation`
    );
    if (
      tmp != undefined &&
      Object.keys(tmp) &&
      Object.keys(tmp).length > 0 &&
      Object.values(tmp[0])[0]
    ) {
      res = Object.values(tmp[0])[0];
      success = true;
    }
  } catch (err) {
    msg = `"~~ Failed to get observation row count. " ${err}`;
    success = false;
    console.warn(msg);
  } finally {
    if (res != undefined && success == true) {
      return res;
    } else {
      throw new Error(msg);
    }
  }
}

/**
 * Enrich and load the specified data into the db
 *
 * @param _rows Array of CleanedDataRow
 * @param importFileName input file name (for logging)
 */
export async function populateDb(
  _rows: CleanedDataRow[],
  importFileName: string
): Promise<boolean> {
  // filter nulls
  const rows = prepareRowsForDb(_rows, importFileName);
  console.log(`~~in populateDb, will attempt to insert ${rows.length} rows.`);

  let res;
  let success = false;
  try {
    const observationRepository = await GetObservationRepository();
    // res = await observationRepository.save(rows, { chunk: 1000 });
    res = await observationRepository.insert(rows);
    if (res) {
      success = true;
    }
  } catch (err) {
    res = `"~~ Failed to insert data. ", err`;
    success = false;
    console.warn(res);
  } finally {
    if (res) {
      console.log("Inserted data in DB! ", res[0]);
    } else {
      res = "Inserted data. result unavailable ";
      console.log(res);
    }
    return success;
  }
}

/**
 * Get grouped observations that meet specified criteria from DB. Group using getDataRowsForEvent by default
 *
 * @param groupFn fn to roll up the full DB rows to groups, relevant to one event + ID Hash. Default: getDataRowsForEvent
 */
export async function getGroupedObservationsFromDb(
  groupFn: (
    rowsIn: Array<HashString & Observation>,
    hashIn: string
  ) => EventRowsGroup<HashString & Observation> = getDataRowsForEvent
): Promise<Array<EventRowsGroup<HashString & Observation>>> {
  let res;
  let msg: string;
  let success = false;
  try {
    const conn = await GetDbConnection();
    let hashes: Array<HashString> = await conn.manager.query(
      `SELECT ParticipantName  || ' ' || MediaName AS Hash, MediaType from "Observation" WHERE MediaType != "N/A" AND (KeyPressEvent == "D1" OR KeyPressEvent == "D2")`
    );

    // escape hashes for SQL query
    const escaped = hashes
      .map((x) => {
        return `'${x.Hash}'`;
      })
      .join(",");

    // query hashes in DB against escaped hash list
    const finalQueryWithIds = `SELECT ParticipantName  || ' ' || MediaName AS Hash, * from "Observation" WHERE Hash in (${escaped})`;
    /*
    writeFileSync("finalQueryWithIds.txt", finalQueryWithIds, "utf8");
    console.log("wrote finalQueryWithIds.txt");
    */

    const finalRes: Array<
      Observation & { Hash: string }
    > = await conn.manager.query(finalQueryWithIds);

    console.log("-- Final DB res length: ", finalRes.length);

    /*
    writeFileSync("finalResults.json", JSON.stringify(finalRes, null, 2));
    console.log("wrote finalResults.json");
    */

    if (finalRes != undefined) {
      const uniqueHashes = getUniqueHashes(finalRes);

      // apply grouper function
      const outputGroups = uniqueHashes
        .map((x) => {
          return groupFn(finalRes, x);
        })
        .filter((x) => {
          return x && x != null;
        });
      res = outputGroups;
      success = true;
    }
    // console.log("In getGroupedObservationsFromDb- result length", res);
  } catch (err) {
    msg = `"~~ Failed to get observation row count. " ${err}`;
    success = false;
    console.warn(msg);
  } finally {
    if (res != undefined && success == true) {
      return res;
    } else {
      throw new Error(msg);
    }
  }
}
