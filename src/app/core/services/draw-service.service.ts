import { Injectable } from '@angular/core';
import {Point} from '../models/point';
// @ts-ignore
import h337 from 'heatmap.js';

@Injectable({
  providedIn: 'root'
})
export class DrawServiceService {
  points: Array<any> = [];
  heatmapInstance: h337;

  constructor() { }

  initHeatmap(radius: number, maxOpacity: number , minOpacity: number): h337 {
    this.heatmapInstance = h337.create({
      radius: radius,
      maxOpacity: maxOpacity,
      minOpacity: minOpacity,
      container: document.querySelector('.heatmap')
    });
  }

  drawFromArray(resultArr: Array<any>, divider: number): void {
    for (const [index, val] of resultArr.entries()) {
      const point: Point = {
        x: Math.floor(resultArr[index].x),
        y: Math.floor(resultArr[index].y),
        value: resultArr[index].times / divider
      };

      this.points.push(point);
    }

    const data = {
      max: 100,
      data: this.points
    };

    this.heatmapInstance.setData(data);
  }

  resetPoints(): void {
    this.points = [];
  }
  destroyHeatmap(): void {
    if (this.heatmapInstance) {
      const canvas = this.heatmapInstance._renderer.canvas;
      // @ts-ignore
      $(canvas).remove();

      this.heatmapInstance = null;
    }
  }
}
