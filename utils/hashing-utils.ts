import { HashString } from "../contracts";

/**
 * Get distinct Hash values from an array of items
 * 
 * @param rows Array of items with a "Hash" property
 */
export const getUniqueHashes = (rows:Array<HashString>):string[] => {
    return Array.from(
      new Set(
        rows
          .map((x) => {
            return x.Hash;
          })
          .filter((x) => {
            return x && x != null;
          })
      )
    );
  };