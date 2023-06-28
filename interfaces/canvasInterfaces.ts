import { ILineOptions } from "fabric/fabric-impl";

export interface ICanvas{
    id:string;
    width:number;
    height:number;
}

export interface MidPoint {
    x: number;
    y: number;
  }
  
  export interface LineCoords
  extends Pick<ILineOptions, 'x1' | 'y1' | 'x2' | 'y2'> {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PathCoords extends LineCoords {
  curveX?: number;
  curveY?: number;
}

export interface options {
  e: {};
  subTargets:[];
  target:{}
}
export interface Point extends MidPoint {
  typeWall: 'rectWall' | 'curveWall';
  radiusX?: number;
  radiusY?: number;
  radiusX2?: number;
  radiusY2?: number;
  valueFeatRadius?: number;
  location?: number;
}

export interface SizeRoom{
  left?:number;
  top?:number;
  width?:number;
  height?:number;
  large?: number;
  deep?: number;
  unitMeasure?: string
}