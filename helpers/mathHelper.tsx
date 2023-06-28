import { LineCoords, MidPoint } from '../interfaces/canvasInterfaces';

//get Mid point of segment
export const midPointSegment = ({ x1, y1, x2, y2 }: LineCoords): MidPoint => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return { x: midX, y: midY };
};
//Angle orientation
export const angleOrientation = ({ x1, y1, x2, y2 }: LineCoords): number =>
  (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

export const angleOrientation360 = ({ x1, y1, x2, y2 }: LineCoords): number =>
  Math.atan2(y2 - y1, x2 - x1) * 180;

//Calcule line segment length
export const lineSegmentLength = ({ x1, y1, x2, y2 }: LineCoords): number => {
  let dist = Math.abs(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
  return dist;
};

//Put convertions
export const measureText = (dimension: number, dimension2?: number): string => {
  let feet = dimension.toString();
  let inches = dimension2?.toString();
  feet = feet.toString() + "'";
  if (inches === undefined || inches === 'NaN') {
    inches = '0"';
  } else {
    inches = inches.toString() + '"';
  }
  const dimensionText = feet;
  return dimensionText;
};
