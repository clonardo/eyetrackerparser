import { HeaderMap, CleanedDataRow } from "../contracts/cleaned-data-row";
import { isString } from "util";
import { TARGET_KEYS } from "./key-constants";

/**
 * Parse header row to get indices of target keys
 * 
 * @param headerRow header row to parse
 */
export function getHeaderIndices(headerRow: string):HeaderMap<CleanedDataRow> {
  if (headerRow && isString(headerRow)) {
    const headerKeys = headerRow
      .trim()
      .split(",")
      .map((x) => {
        return x.trim();
      });
    let initMap: HeaderMap<CleanedDataRow> = new Map<
      keyof CleanedDataRow,
      number
    >();
    return TARGET_KEYS.reduce((acc, iter) => {
      let idx = headerKeys.indexOf(iter);
      if (idx != -1) {
        return acc.set(iter, idx);
      } else {
        return acc;
      }
    }, initMap);
  } else {
    throw new Error("Invalid input format for header");
  }
}
