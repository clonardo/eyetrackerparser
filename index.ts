// import { Prompt  } from 'enquirer';
const { Select } = require("enquirer");
import { InitializeApp } from "./tasks/initialize-app";
import { FetchAndAnalyzeDataFromDb } from "./tasks/analyze-db-data";

enum MENU_ACTION {
  /**
   * Populate database
   */
  POPULATE_DB = "Load data from CSVs into database",
  /**
   * Analyze data that has already been loaded in to the database
   */
  ANALYZE_DB_DATA = "Analyze data from database",
  /**
   * Load CSVs, parse, and generate output analyses
   */
  ANALYZE_CSVS = "Load and analyze CSV file(s)",

  RESET_STATE = "Reset app state- delete database and reload config",

  /**
   * Cancel/exit
   */
  EXIT_APP = "Nothing. Exit the application.",
}

const mainMenuPrompt = new Select({
  name: "action",
  hint: "(Use arrow keys to select, <return> to submit)",
  header: "-- Eye tracker data analysis tool --",
  message: "What do you want to do?",
  choices: [
    MENU_ACTION.POPULATE_DB,
    MENU_ACTION.ANALYZE_DB_DATA,
    MENU_ACTION.ANALYZE_CSVS,
    MENU_ACTION.RESET_STATE,
    MENU_ACTION.EXIT_APP,
  ],
});

/**
 * Run some async function, log basic confirmation output, and exit the program
 *
 * @param fn async function to execute
 * @param logName string to use for logging
 */
const asyncExecutor = (fn: () => Promise<any>, logName: string) => {
  fn()
    .then((res) => {
      console.log(`${logName}: Completed successfully, exiting`);
      process.exit();
    })
    .catch((err) => {
      console.error(`${logName}: An error has occurred. ${err}`);
      console.error(`${logName}: Exiting`);
      process.exit(1);
    });
};

const launchMainMenu = () => {
  mainMenuPrompt
    .run()
    .then((answer: MENU_ACTION) => {
      console.log("Selected action:", answer);
      switch (answer) {
        case MENU_ACTION.POPULATE_DB: {
          console.log("TODO: task to populate DB data");
          break;
        }
        case MENU_ACTION.ANALYZE_DB_DATA: {
          asyncExecutor(FetchAndAnalyzeDataFromDb, MENU_ACTION.ANALYZE_DB_DATA);
          break;
        }
        case MENU_ACTION.RESET_STATE: {
          console.log("TODO: reset state");
          break;
        }

        default: {
          console.log("Invalid selection. Exiting.");
          process.exit();
        }
      }
    })
    .catch((err) => {
      console.error("An error has occurred: ", err);
      console.error("Exiting app..");
      process.exit(1);
    });
};

InitializeApp()
  .then((summary) => {
    if (summary) {
      console.log(`App state: ${JSON.stringify(summary, null, 2)}`);
    } else {
      console.log(`App state undefined`);
    }
    launchMainMenu();
  })
  .catch((err) => {
    console.warn("Error initializing app: ", err);
  });
