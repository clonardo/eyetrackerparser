import { userConfigStore } from "../config/user-config";
import { sqliteOptions } from "../config/sqlite-conn.config";
import {
  getObsRowCount,
  getGroupedObservationsFromDb,
} from "./observations-service";
import { existsSync } from "fs";
import { getOutputGroupAggregate } from "../utils/analysis-utils";
import { WriteOutputFile } from "./save-results";
import { AnalysisEnrichedRow } from "../contracts";

/**
 * Query DB to get data and apply analysis. Writes result to file
 */
export async function FetchAndAnalyzeDataFromDb(): Promise<
  Array<AnalysisEnrichedRow>
> {
  return new Promise<Array<AnalysisEnrichedRow>>(async (resolve, reject) => {
    console.log("In FetchAndAnalyzeDataFromDb");
    try {
      const groupResults = await getGroupedObservationsFromDb();
      console.log(
        "got groupResults: ",
        groupResults.length,
        " , starting final analysis."
      );
      // iterate over groups to get group aggregate for whatever analysis is cooking..
      const postAnalysis = groupResults
        .map((x) => {
          return getOutputGroupAggregate(x);
        })
        .filter((x) => {
          return x && x != null;
        });

      if (postAnalysis && postAnalysis.length) {
        console.log(
          "In FetchAndAnalyzeDataFromDb, final output size: ",
          postAnalysis.length
        );

        const FILE_OUTPUT_NAME = "pupil_deltas";
        await WriteOutputFile(
          postAnalysis,
          FILE_OUTPUT_NAME,
          userConfigStore.get("outputPath")
        );
        resolve(postAnalysis);
      } else {
        console.log(
          "FetchAndAnalyzeDataFromDb: output is empty. check your analysis"
        );
        resolve([]);
      }
    } catch (err) {
      console.error("Unable to fetch and analyze DB data: ", err);
      reject(err);
    }
  });
}
