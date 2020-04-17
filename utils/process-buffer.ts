import { HeaderMap, CleanedDataRow } from "../contracts/cleaned-data-row";
import { getHeaderIndices } from "./parse-header";
import { constructRow } from "./construct-row";

/**
 * Process buffered strings
 */
export const processBufferedString = (
  buffStr: string[]
): Array<CleanedDataRow> => {
  let headerMap: HeaderMap<CleanedDataRow>;
  let lines: string[] = buffStr
    .join("")
    .split("\n")
    .filter((x, idx) => {
      if (!x) {
        return false;
      } else {
        // filter out garbage lines
        const JOINED_TRIMMED = x
          .split(",")
          .map((col) => {
            return col.trim();
          })
          .filter((col) => {
            return col != undefined && col != null;
          })
          .join();

        // if (idx == 10) {
        //   console.log("input to parse: ", x);
        // }
        // #CLTODO: doesn't work on huge dataset due to extra columns
        /*
        const ALL_COMMAS: string = `,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,`;
        return JOINED_TRIMMED && JOINED_TRIMMED.indexOf(ALL_COMMAS) == -1;
        */
        return JOINED_TRIMMED != undefined;
      }
    });

  console.log(`Parsing ${lines.length} lines / raw input: ${buffStr.length}`);

  // #CLDEBUG: check
  return lines
    .map((iter, idx) => {
      if (idx % 1000 == 0) {
        const pct = Math.round((idx / lines.length) * 100);
        console.log(`Parsing row ${idx}: ${pct}% complete`);
      }
      if (idx == 0) {
        headerMap = getHeaderIndices(iter);
        // console.log(Array.from(headerMap.keys()));
        // console.log(Array.from(headerMap.values()));
        return null;
      } else {
        //console.log("line: ", iter);
        const constructed = constructRow(iter, headerMap);
        // console.log("constructed: ", constructed);
        return constructed;
      }
    }, [])
    .filter((x) => {
      return x != null;
    });
};
