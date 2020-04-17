import {
  CleanedDataRow,
  AnnotatedCleanedDataRow,
} from "../contracts/cleaned-data-row";
import { classifyMedia } from "./classification-utils";

/**
 * For a given index in the provided input array, extract n previous rows (exclusive)
 *
 * @param rows input rows
 * @param targetIndex index from which to start going backward in data
 * @param prevNRows how many rows to go back
 */
const getRowsBack = (
  rows: Array<CleanedDataRow>,
  targetIndex: number,
  prevNRows: number
): CleanedDataRow[] => {
  if (rows && rows.length) {
    const startIndex = targetIndex - prevNRows;
    if (startIndex < 0) {
      throw new Error("Array index error: you can't extract that many items");
    } else {
      return rows.slice(startIndex, targetIndex);
    }
  } else {
    throw new Error("Invalid input array provided");
  }
};

/**
 * For a given array of indices in the provided input array, extract n previous rows (exclusive) as a group
 *
 * @param rows input rows
 * @param targetIndices indices of target items from which to start going backward in data
 * @param prevNRows how many rows to go back (default: 10)
 */
export const getPreviousNRows = (
  rows: Array<CleanedDataRow>,
  targetIndices: number[],
  prevNRows: number = 10
): Map<CleanedDataRow, CleanedDataRow[]> => {
  if (!Array.isArray(rows)) {
    throw new Error("Cleaned data rows not provided");
  } else if (!Array.isArray(targetIndices)) {
    throw new Error(
      "Target indices rows not provided, check your filter function"
    );
  } else {
    let outputMap = new Map<CleanedDataRow, CleanedDataRow[]>();
    return targetIndices.reduce((acc, iter) => {
      // get an individual grouping
      const groupVals = getRowsBack(rows, iter, prevNRows);
      return outputMap.set(rows[iter], groupVals);
    }, outputMap);
  }
};

/**
 * Log basic info about a provided map to the console
 *
 * @param inputMap some kind of map
 */
export const summarizeMap = (inputMap: Map<any, any>): void => {
  if (inputMap) {
    if (inputMap.size) {
      console.log(`Got ${inputMap.size} groups`);
    } else {
      console.log("WARNING: Input map is empty");
    }
  } else {
    console.log("WARNING: Input map not provided");
  }
};

/**
 * Round a number to n decimal places
 * @param number input
 * @param prec precision
 */
function roundOutput(number: number, prec: number) {
  let tempnumber = number * Math.pow(10, prec);
  tempnumber = Math.round(tempnumber);
  return tempnumber / Math.pow(10, prec);
}

/**
 * For a given output map entry (grouped n rows), figure out the left/right pupil averages, and assign into copy of inputKey
 *
 * @param inputKey inputKey object to assign into
 * @param inputVals Group of rows from which to extract pupil data
 */
const getPupilAveragesAndAssembleSingleOutput = (
  inputKey: CleanedDataRow,
  inputVals: CleanedDataRow[]
): AnnotatedCleanedDataRow => {
  if (inputKey && inputVals) {
    // get denominators
    const pupilLeftCount = inputVals.filter((x) => {
      return x.PupilLeft != undefined;
    }).length;
    const pupilRightCount = inputVals.filter((x) => {
      return x.PupilRight != undefined;
    }).length;

    const mediaTypes = classifyMedia(inputKey.MediaName);
    if (pupilLeftCount && pupilRightCount) {
      // case: valid data, lookin' good
      const outputNote =
        pupilRightCount == pupilLeftCount
          ? ""
          : `Mismatch in data length in preceding rows. left: ${pupilLeftCount}, right: ${pupilRightCount}`;
      let pupilSubtotalAccumulator = { PupilRight: 0, PupilLeft: 0 };
      // get subtotals for averages
      const pupilSubtotals = inputVals.reduce((acc, iter) => {
        const cleanedRight = iter.PupilRight != undefined ? iter.PupilRight : 0;
        const cleanedLeft = iter.PupilLeft != undefined ? iter.PupilLeft : 0;
        return {
          PupilRight: acc.PupilRight += cleanedRight,
          PupilLeft: acc.PupilLeft += cleanedLeft,
        };
      }, pupilSubtotalAccumulator);

      const rightAvg = pupilSubtotals.PupilRight / pupilRightCount;
      const leftAvg = pupilSubtotals.PupilLeft / pupilLeftCount;
      if (isNaN(leftAvg) || isNaN(rightAvg)) {
        console.log(
          `~~~ERROR COMPUTING AVERAGES L: ${leftAvg}/ R: ${rightAvg} for ${JSON.stringify(
            inputKey,
            null,
            2
          )}`
        );
        console.log(
          `~~~Input subtotals: L: ${pupilSubtotals.PupilLeft}, L: ${pupilSubtotals.PupilRight}`
        );
        console.log(
          `~~~Input counts: L: ${pupilLeftCount}, L: ${pupilRightCount}`
        );
        console.log(`~~~Input rows: ${JSON.stringify(inputVals, null, 2)}`);
      }
      return {
        ...inputKey,
        ...mediaTypes,
        ...{
          PupilRight: roundOutput(rightAvg, 3),
          PupilLeft: roundOutput(leftAvg, 3),
          Note: outputNote,
        },
      };
    } else {
      // case: valid data no pupil data
      const note = `NOTE: Left pupil data count ${pupilLeftCount}, right count: ${pupilRightCount}`;
      /*
      console.log(
        `~~ WARNING: Invalid data for  ${JSON.stringify(inputKey, null, 2)}`
      );
      console.log(`~~~~ ${note}`);
      */
      // throw new Error("Pupil data invalid or data length mismatch");
      return {
        ...inputKey,
        ...mediaTypes,
        ...{
          PupilRight: 0,
          PupilLeft: 0,
          Note: note,
        },
      };
    }
  } else {
    throw new Error("Cannot aggregate data: valid inputs not provided");
  }
};

/**
 * Aggregate pupil data for final output
 *
 * @param inputMap map of grouped inputs to aggregate
 */
export const getPupilAveragesAndAssembleOutputs = (
  inputMap: Map<CleanedDataRow, CleanedDataRow[]>
): AnnotatedCleanedDataRow[] => {
  if (inputMap && inputMap.size) {
    const mapKeys = Array.from(inputMap.keys());
    return mapKeys.map((k) => {
      return getPupilAveragesAndAssembleSingleOutput(k, inputMap.get(k));
    });
  } else {
    console.warn("Valid input map not provided: cannot get pupil averages");
    return [];
  }
};
