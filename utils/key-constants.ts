import { CleanedDataRow } from "../contracts/cleaned-data-row";

/**
 * String header keys to extract
 */
export const TARGET_STRING_KEYS: Array<keyof CleanedDataRow> = [
  "ParticipantName",
  "MediaName",
  "SegmentName",
  "KeyPressEvent",
];

/**
 * Numeric keys to extract
 */
export const TARGET_NUMERIC_KEYS: Array<keyof CleanedDataRow> = [
  "SegmentEnd",
  "SegmentDuration",
  "FixationIndex",
  "PupilLeft",
  "PupilRight",
];

/**
 * Header keys to extract
 */
export const TARGET_KEYS: Array<keyof CleanedDataRow> = [
  ...TARGET_STRING_KEYS,
  ...TARGET_NUMERIC_KEYS,
];
