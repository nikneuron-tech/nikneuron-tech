import {
  FACES_CONFIG,
  FaceConfig,
  FaceItemConfig,
  getFaceById,
  getFaceByIndex,
  getAllFaces,
  getAllItems,
  getFaceTargetQuaternion,
  findNearestFaceIndex,
} from '../config/faces.config';

export type ComponentItem = FaceItemConfig;
export type FaceData = FaceConfig;

export const FACES_DATA = FACES_CONFIG;

export {
  FACES_CONFIG,
  getFaceById,
  getFaceByIndex,
  getAllFaces,
  getAllItems,
  getFaceTargetQuaternion,
  findNearestFaceIndex,
};

export default FACES_DATA;
