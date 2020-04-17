import { EventRowsGroup, HashString, AnalysisEnrichedRow } from "../contracts";
import { Observation } from "../entity/observation";

/**
 * Enrich and process grouped row.
 * Currently set up to extract deltas in r/l pupils for a given event
 *
 * @param grouped grouped data with respec to a given event row
 */
export function getOutputGroupAggregate<
  T extends HashString & Observation = HashString & Observation
>(grouped: EventRowsGroup<T>): AnalysisEnrichedRow {
  if (grouped) {
    const { eventRow, innerRows } = grouped;

    if (innerRows && innerRows.length > 1) {
      const firstRow = innerRows[0];
      const lastRow = innerRows[innerRows.length - 1];
      // get changes
      const deltas = {
        PupilRightDelta: lastRow.PupilRight - firstRow.PupilRight,
        PupilLeftDelta: lastRow.PupilLeft - firstRow.PupilLeft,
        PupilRightStart: firstRow.PupilRight,
        PupilRightEnd: lastRow.PupilRight,
        PupilLeftStart: firstRow.PupilLeft,
        PupilLeftEnd: lastRow.PupilLeft,
        // also get ID of first + last row, for good measure
        FirstRowId: firstRow.id,
        LastRowId: lastRow.id,
      };
      return { ...eventRow, ...deltas };
    } else {
      console.log("Insufficient data for hash ", eventRow.Hash);
      return null;
    }
  } else {
    console.log("No valid data provided for analysis.");
    return null;
  }
}
