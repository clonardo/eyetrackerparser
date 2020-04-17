/**
 * Raw eye tracker data row from CSV
 */
export interface RawDataRow {
  StudioTestName: string;
  ParticipantName: string;
  RecordingDuration: number;
  MediaName: string;
  SegmentName: string;
  SegmentEnd: number;
  SegmentDuration: number;
  /**
   * undefined, D1 (vertical) or D2 (horizontal)
   */
  KeyPressEvent?: string;
  FixationIndex: number;
  SaccadeIndex: string;
  GazeEventType: string;
  GazeEventDuration: number;
  "FixationPointX (MCSpx)": number;
  "FixationPointY (MCSpx)": number;
  "AOI[Whole stimulus]Hit": number;
  "AOI[Inner Half]Hit": number;
  "AOI[Quadrant 1]Hit": number;
  "AOI[Quadrant 1]Hit__1": string;
  "AOI[Quadrant 1]Hit__2": string;
  "AOI[Quadrant 1]Hit__3": string;
  "AOI[Quadrant 1]Hit__4": string;
  "AOI[Quadrant 1]Hit__5": string;
  "AOI[Quadrant 1]Hit__6": string;
  "AOI[Quadrant 1]Hit__7": string;
  "AOI[Quadrant 3]Hit": number;
  "AOI[Quadrant 4]Hit": number;
  "AOI[Quadrant 2]Hit": number;
  "AOI[Quadrant 2]Hit__1": string;
  "AOI[Quadrant 3]Hit__1": string;
  "AOI[Quadrant 4]Hit__1": string;
  "AOI[Quadrant 2]Hit__2": string;
  "AOI[Quadrant 3]Hit__2": string;
  "AOI[Quadrant 4]Hit__2": string;
  "AOI[Quadrant 2]Hit__3": string;
  "AOI[Quadrant 3]Hit__3": string;
  "AOI[Quadrant 4]Hit__3": string;
  "AOI[Quadrant 2]Hit__4": string;
  "AOI[Quadrant 3]Hit__4": string;
  "AOI[Quadrant 4]Hit__4": string;
  "AOI[Quadrant 2]Hit__5": string;
  "AOI[Quadrant 3]Hit__5": string;
  "AOI[Quadrant 4]Hit__5": string;
  "AOI[Quadrant 2]Hit__6": string;
  "AOI[Quadrant 3]Hit__6": string;
  "AOI[Quadrant 4]Hit__6": string;
  "AOI[Quadrant 2]Hit__7": string;
  "AOI[Quadrant 3]Hit__7": string;
  "AOI[Quadrant 4]Hit__7": string;
  "GazePointLeftX (ADCSmm)": number;
  "GazePointLeftY (ADCSmm)": number;
  "GazePointRightX (ADCSmm)": number;
  "GazePointRightY (ADCSmm)": number;
  /**
   * Target
   */
  PupilLeft: number;
  /**
   * Target
   */
  PupilRight: number;
}
