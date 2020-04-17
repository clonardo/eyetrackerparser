import { HeaderMap, CleanedDataRow } from "../contracts/cleaned-data-row";
import { TARGET_NUMERIC_KEYS, TARGET_STRING_KEYS } from "./key-constants";

/**
 * Filter relevant keys, and invert map to be keyed by number
 */
const filterAndInvertMap = (
  mapIn: HeaderMap<CleanedDataRow>,
  targetKeys: Array<keyof CleanedDataRow>
): Map<number, keyof CleanedDataRow> => {
  let mapOut = new Map<number, keyof CleanedDataRow>();
  let entries = Array.from(mapIn.keys()).reduce((acc, iter) => {
    return { ...acc, ...{ [iter]: mapIn.get(iter) } };
  }, {});
  return Object.keys(entries).reduce((acc, iter) => {
    if (targetKeys.indexOf(iter as any) != -1) {
      return mapOut.set(entries[iter], iter as any);
    } else {
      return acc;
    }
  }, mapOut);
};

let numberKeyMap: Map<number, keyof CleanedDataRow>;
let stringKeyMap: Map<number, keyof CleanedDataRow>;

const getKeyMaps = (headerMap: HeaderMap<CleanedDataRow>) => {
  if (numberKeyMap && stringKeyMap && numberKeyMap.size && stringKeyMap.size) {
    /*
    console.log(
      " getKeyMaps, already has numberKeyMap: ",
      Array.from(numberKeyMap.keys())
    );
    */
    return [numberKeyMap, stringKeyMap];
  } else {
    numberKeyMap = filterAndInvertMap(headerMap, TARGET_NUMERIC_KEYS);
    // console.log(" getKeyMaps numberKeyMap: ", Array.from(numberKeyMap.keys()));
    stringKeyMap = filterAndInvertMap(headerMap, TARGET_STRING_KEYS);
    return [numberKeyMap, stringKeyMap];
  }
};

/**
 *
 * @param line Single non-header line
 * @param headerMap Map of header contents
 */
export const constructRow = (
  line: string,
  headerMap: HeaderMap<CleanedDataRow>
): CleanedDataRow => {
  //console.log("headerMap: ", Array.from(headerMap.keys()));
  // get key mappings
  [numberKeyMap, stringKeyMap] = getKeyMaps(headerMap);

  if (line && headerMap) {
    const vals = line.split(",").map((x) => {
      return x.trim();
    });
    let output: any = {};
    return vals.reduce((acc, iter, idx) => {
      if (numberKeyMap.has(idx)) {
        const k = numberKeyMap.get(idx);
        const vRaw = vals[idx];
        if (vRaw != undefined && vRaw != "") {
          // try parsing as float first
          const fl = parseFloat(vRaw);
          if (typeof fl === "number") {
            if (Math.round(fl) === fl && fl.toString().indexOf(".") < -1) {
              // treat as int
              return { ...acc, ...{ [k]: parseInt(vRaw) } };
            } else {
              // treat as float
              return { ...acc, ...{ [k]: fl } };
            }
          }
        } else {
          return { ...acc, ...{ [k]: undefined } };
        }
      } else if (stringKeyMap.has(idx)) {
        const k = stringKeyMap.get(idx);
        const v = vals[idx] as string;
        return { ...acc, ...{ [k]: v } };
      } else {
        return acc;
      }
    }, output) as CleanedDataRow;
  } else {
    throw new Error("Unable to parse line, invalid input");
  }
};
