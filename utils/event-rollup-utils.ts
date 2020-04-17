import { Observation } from "../entity/observation";
import { HashString, EventRowsGroup } from "../contracts";
import { filterKeyPressEventsTest } from "./filter-utils";

/**
 * Get group of relevant rows occurring before a given event
 *
 * @param rows array of hashed rows
 * @param tgtHash hash to extract (unique to items going into this group)
 */
export const getDataRowsForEvent = (
  rows: Array<HashString & Observation>,
  tgtHash: string
): EventRowsGroup<HashString & Observation> => {
  let filteredRows = rows.filter((x) => {
    return x.Hash == tgtHash;
  });
  // get index of target key event
  let eventRow = filteredRows.filter((x) => {
    // filter for d1 / d2 keypress events
    return filterKeyPressEventsTest(x);
  });
  if (eventRow && eventRow.length) {
    // filter rows that happened after the event, as well as any that are missing data
    let relevantRows = filteredRows.filter((x) => {
      return (
        x.id < eventRow[0].id &&
        x.PupilLeft != undefined &&
        x.PupilRight != undefined
      );
    });
    return { eventRow: eventRow[0], innerRows: relevantRows };
  } else {
    // return null if useless..
    return null;
  }
};
