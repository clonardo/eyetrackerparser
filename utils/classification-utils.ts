import { StimulusClassification } from "../contracts/classifications";
import { isString } from "util";

const resolveMediaType = (mediaType: string) => {
  if (mediaType && isString(mediaType)) {
    const clean = mediaType.toLowerCase().trim();
    switch (clean) {
      case "col": {
        return "COLOR";
        break;
      }
      case "lum": {
        return "LUMIN";
        break;
      }
      case "gab": {
        return "GABOR";
        break;
      }
      default: {
        return "N/A";
      }
    }
  } else {
    return "N/A";
  }
};

export const resolveOrientation = (
  mediaType: string
): "H" | "V" | undefined => {
  if (mediaType && isString(mediaType)) {
    const clean = mediaType.toUpperCase().trim();
    switch (clean) {
      case "H": {
        return "H";
        break;
      }
      case "V": {
        return "V";
        break;
      }
      default: {
        return;
      }
    }
  } else {
    return;
  }
};

/**
 * Extract media type, level, and orientation from a single row
 */
export const classifyMedia = (mediaName: string): StimulusClassification => {
  const unknownResult: StimulusClassification = {
    MediaType: "N/A",
  };
  if (mediaName && isString(mediaName) && mediaName.trim().length > 0) {
    // extract capture groups from types like col100h1.3.jpg, lum100v1.3.jpg., etc.
    const regex = /(col|gab|lum)(\d\d\d?)(h|v)/g;
    const matches = regex.exec(mediaName);
    if (matches && matches.length > 3) {
      return {
        MediaType: resolveMediaType(matches[1]),
        Level: parseInt(matches[2]),
        Orientation: resolveOrientation(matches[3]),
      };
    } else {
      return unknownResult;
    }
  } else {
    return unknownResult;
  }
};
