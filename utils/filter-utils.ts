import { CleanedDataRow } from "../contracts/cleaned-data-row";

/**
 * For each row, check if it should be included in the output
 * In this case, test if KeyPressEvent is D1 or D2
 *
 * @param row item with KeyPressEvent to check
 */
export const filterKeyPressEventsTest = (row: {
  KeyPressEvent?: string;
}): boolean => {
  if (row && row.KeyPressEvent != undefined) {
    const evtType = row.KeyPressEvent.toLowerCase().trim();
    return evtType == "d1" || evtType == "d2";
  } else {
    return false;
  }
};

/**
 * Get indices of rows matching filter conditions
 * @param rows Parsed rows
 */
export const getTargetRowIndices = (rows: Array<CleanedDataRow>): number[] => {
  if (rows && rows.length) {
    let outputIndices: number[] = [];
    return rows.reduce((acc, iter, idx) => {
      if (filterKeyPressEventsTest(iter)) {
        return [...acc, ...[idx]];
      } else {
        return acc;
      }
    }, outputIndices);
  } else {
    return [];
  }
};
