import { Observation } from "../entity/observation";

/**
 * A thing with a distinct hash
 */
export type HashString = { Hash: string };

/**
 * All of the types that are added on for analysis
 */
export type AnalysisEnrichment = {
  /**
   * Before/after delta: right
   */
  PupilRightDelta: number;
  /**
   * Before/after delta: left
   */
  PupilLeftDelta: number;
  /**
   * Pupil size at start of window: right
   */
  PupilRightStart: number;
  /**
   * Pupil size at end of window: right
   */
  PupilRightEnd: number;
  /**
   * Pupil size at start of window: left
   */
  PupilLeftStart: number;
  /**
   * Pupil size at end of window: left
   */
  PupilLeftEnd: number;
  /**
   * "Id" field of "start" row, for referring back to it
   */
  FirstRowId: number;
  /**
   * "Id" field of "end" row, for referring back to it
   */
  LastRowId: number;
};

/**
 * Enriched Observation row, with derived (analysis) data and distinct hashes
 */
export type AnalysisEnrichedRow = AnalysisEnrichment & HashString & Observation;

/**
 * Group of observations corresponding to a single event, for further aggregation
 */
export type EventRowsGroup<T = HashString & Observation> = {
  /**
   * The row corresponding to an event (e.g., a keypress)
   */
  eventRow: T;
  /**
   * Rows that are relevant and included for analysis leading up to the eventRow
   */
  innerRows: Array<T>;
};
