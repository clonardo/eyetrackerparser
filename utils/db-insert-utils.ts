import { StimulusClassification } from "../contracts/classifications";
import { CleanedDataRow } from "../contracts/cleaned-data-row";
import { Observation } from "../entity/observation";
import { classifyMedia } from "./classification-utils";

/**
 * Convert rows to entities
 *
 * @param _rows array of rows
 * @param fileName source file name
 */
export const prepareRowsForDb = (
  _rows: CleanedDataRow[],
  fileName: string
): Observation[] => {
  return _rows
    .filter((x) => {
      return x && x.ParticipantName != null;
    })
    .map((x) => {
      const mediaClassifications = classifyMedia(x.MediaName);
      return {
        // id: null,
        // updatedDate: null,
        ParticipantName: x.ParticipantName,
        MediaName: x.MediaName,
        MediaType: mediaClassifications.MediaType,
        Level: mediaClassifications.Level,
        Orientation: mediaClassifications.Orientation,
        SegmentName: x.SegmentName,
        SegmentEnd: x.SegmentEnd,
        SegmentDuration: x.SegmentDuration,
        KeyPressEvent: x.KeyPressEvent,
        FixationIndex: x.FixationIndex,
        PupilLeft: x.PupilLeft,
        PupilRight: x.PupilRight,
        InputFileName: fileName,
      };
    });
};
