/**
 * Classify a stimulus
 */
export interface StimulusClassification {
  MediaType: "GABOR" | "LUMIN" | "COLOR" | "N/A";
  Level?: number;
  Orientation?: "H" | "V";
}
