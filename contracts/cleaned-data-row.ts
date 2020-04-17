import { StimulusClassification } from './classifications'

export interface CleanedDataRow {
  ParticipantName: string;
  MediaName: string;
  SegmentName: string;
  SegmentEnd: number;
  SegmentDuration: number;
  KeyPressEvent?: string;
  FixationIndex: number;
  /**
   * Target
   */
  PupilLeft?: number;
  /**
   * Target
   */
  PupilRight?: number;
}

/**
 * Annotate final outputs (add notes and classifications)
 */
export type AnnotatedCleanedDataRow = Exclude<CleanedDataRow, "MediaName"> & {
  Note: string;
} & StimulusClassification;

/**
 * Map object keys to indices in header
 */
export type HeaderMap<T extends Object> = Map<keyof T, number>;

/*
const hm:HeaderMap<CleanedDataRow> = {
    PupilLeft: 42
}
*/
