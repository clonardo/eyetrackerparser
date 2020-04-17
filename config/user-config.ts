import * as Conf from "conf";

type UserConfig = {
  /**
   * Where to look for input CSVs
   */
  inputPath: string;
  /**
   * Where to save output
   */
  outputPath: string;
};

/**
 * Default user config
 */
export const defaultUserConfig: UserConfig = {
  inputPath: "inputs",
  outputPath: "outputs",
};
/**
 * User configuration store
 */
export const userConfigStore = new Conf<UserConfig>({
  defaults: defaultUserConfig,
});

/**
 * Reset all user config settings
 */
export const resetUserConfig = () => {
  userConfigStore.reset();
};
