import { existsSync, openSync, closeSync, readSync, writeFileSync } from "fs";
import { CleanedDataRow, HeaderMap } from "./contracts/cleaned-data-row";
import { processBufferedString } from "./utils/process-buffer";
import { getTargetRowIndices } from "./utils/filter-utils";
import "reflect-metadata";

import {
  getPreviousNRows,
  summarizeMap,
  getPupilAveragesAndAssembleOutputs,
} from "./utils/aggregation-utils";

import { Observation } from "./entity/observation";
import { prepareRowsForDb } from "./utils/db-insert-utils";
import { populateDb } from "./tasks/observations-service";
import { WriteOutputFile } from "./tasks/save-results";
import { userConfigStore } from "./config/user-config";

// color
const importFileName = `PO Color Set 1 Large_Data_Export`;
// const importFileName = `PO Color Set 2 Large_Data_Export`;

// lumin- DONE
// const importFileName = `PO Lumin Set 1 Large_Data_Export`;
// const importFileName = `PO Lumin Set 2 Large_Data_Export`;

// gabor- DONE
// const importFileName = `PO Gabor Set 1 Large_Data_Export`;
// const importFileName = `PO Gabor Set 2 Large_Data_Export`;
const targetFile = `C:\\eyetrackerdata\\yanbin\\${importFileName}.csv`;

// --- Lumin
// const targetFile = `C:\\eyetrackerdata\\yanbin\\PO Lumin Set 1 Large_Data_Export.csv`;
// const targetFile = `C:\\eyetrackerdata\\yanbin\\PO Lumin Set 2 Large_Data_Export.csv`;
//
// smaller file
// const targetFile = `C:\\eyetrackerdata\\cj\\PO Color Set 1 Large_Data_Export.csv`;

const foundFile = existsSync(targetFile);
if (foundFile) {
  console.log("File exists, parsing");
  const fd = openSync(targetFile, "r");
  let count = 0;

  let buffStr: string[] = [];
  do {
    // create buffer inside "do" statement. do not reuse buffer
    const buffer = Buffer.alloc(2048);

    // note the null position parameter
    count = readSync(fd, buffer, 0, buffer.length, null);
    buffStr.push(buffer.toString());
    // loop through until bytes read on a given pass hits zero
  } while (count > 0);

  if (buffStr) {
    // parse
    const results = processBufferedString(buffStr);
    console.log("results length", results.length);

    /*
    populateDb(results, importFileName)
      .then((res) => {
        console.log("finished populateDb");
      })
      .catch((err) => {
        console.warn("Error in populateDb: ", err);
      });
    */
    // #CLTODO: analytics outputs

    // figure out which rows have relevant keypress events: d1/d2
    const targetIndices = getTargetRowIndices(results);
    // console.log(Array.from(targetIndices.values()));
    // get previous n rows
    const groupedRows = getPreviousNRows(results, targetIndices, 10);
    summarizeMap(groupedRows);

    const finalOutputs = getPupilAveragesAndAssembleOutputs(groupedRows);
    console.log(`Got final output length: ${finalOutputs.length}`);

    const outputDir = userConfigStore.get('outputPath');
    WriteOutputFile(finalOutputs, importFileName, outputDir);

    // console.table(finalOutputs);
  }

  console.log("END!");

  // clean up after yourself
  closeSync(fd);
} else {
  console.log(`Unable to find ${targetFile}`);
}
