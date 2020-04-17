import { AnnotatedCleanedDataRow } from "../contracts/cleaned-data-row";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { writeFile, exists } from "fs";
import { unparse } from "papaparse";
import { join } from "path";
import { root } from "../config/root-path";
import { promisify } from "util";
import { HashString } from "../contracts";
import { Observation } from "../entity/observation";

// promisify some things
const writeFileProm = promisify(writeFile);
const existsProm = promisify(exists);

/**
 * Write files to directory
 *
 * @param finalOutputs Annotated rows
 * @param filePrefix prefix (name) to use before timestamp and extension
 * @param directory Target directory. Default: 'outputs'
 */
export async function WriteOutputFile<T= HashString & Observation>(
  finalOutputs: Array<T>,
  filePrefix: string,
  directory: string
) {
  const fileName = `${filePrefix}-${Date.now()}.csv`;
  const fullPath = join(root, directory, fileName);
  // const fullPath = fileName;
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const tgtDir = join(root, directory);
      const dirExists = await existsProm(tgtDir);
      if (!dirExists) {
        mkdirSync(tgtDir);
        console.log(`Created ${tgtDir}`);
      }
      await writeFileProm(fullPath, unparse(finalOutputs), {
        encoding: "utf8",
      });
      console.log(`Wrote file to ${fullPath}`);
      resolve(true);
    } catch (err) {
      console.warn("Could not write file: ", err);
      reject(false);
    }
  });
}
