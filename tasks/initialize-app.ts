import { userConfigStore } from "../config/user-config";
import { sqliteOptions } from "../config/sqlite-conn.config";
import { getObsRowCount } from "./observations-service";
import { existsSync } from "fs";

/**
 * Get basic info describing current app state
 */
type AppStateSummary = {
  dbRowCount: number;
  dbExists: boolean;
  inputPath: string;
  outputPath: string;
};

/**
 * Query DB to get current state
 */
export async function InitializeApp(): Promise<AppStateSummary> {
  return new Promise<AppStateSummary>(async (resolve, reject) => {
    try {
      const _inputPath = userConfigStore.get("inputPath");
      const _outputPath = userConfigStore.get("outputPath");

      const _rowCount = await getObsRowCount();

      const result = {
        dbRowCount: _rowCount,
        dbExists: existsSync(sqliteOptions.database as string),
        inputPath: _inputPath,
        outputPath: _outputPath,
      };
      console.log(
        "In InitializeApp, result: ",
        JSON.stringify(result, null, 2)
      );
      resolve(result);
    } catch (err) {
      console.error("Unable to initialize app state: ", err);
      reject(err);
    }
  });
}
