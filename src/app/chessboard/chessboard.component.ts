import { Component, OnInit } from '@angular/core';
declare const Chessboard: any;
import {FirstMoveWhite} from '../core/data/first-move-white-data';
import {FirstMoveBlack} from '../core/data/first-move-black-data';
import {LastMoveKingPosition} from '../core/data/last-move-king-position-data';
import {HeatmapTypes} from '../core/models/heatmap-types';
import {MoveServiceService} from '../core/services/move-service.service';
import {DrawServiceService} from '../core/services/draw-service.service';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss']
})
export class ChessboardComponent implements OnInit {
  activeHeatMapHeader: HeatmapTypes | undefined;
  selectedOption = '1';
  heatmapPosition = 'absolute';
  moveMappedArray: Array<any> = [];

  constructor(private moveService: MoveServiceService, private drawService: DrawServiceService) {

  }

  initChessBoard(): void {
    const board1 = Chessboard('board1', 'start');
  }

  changeHeatmapType(type: string): void {
    this.activeHeatMapHeader = HeatmapTypes.first;
  }

  changeHeatmap(): void {
    this.drawService.resetPoints();
    this.drawService.destroyHeatmap();

    switch (this.selectedOption) {
      case '1':
        this.drawService.initHeatmap(90, .8, .1);
        this.activeHeatMapHeader = HeatmapTypes.first;
        const arr = this.moveService.createResultArray(FirstMoveWhite, this.moveMappedArray);
        this.drawService.drawFromArray(arr, 2);
        break;
      case '2':
        this.drawService.initHeatmap(90, .8, .1);
        this.activeHeatMapHeader = HeatmapTypes.second;
        const arr2 = this.moveService.createResultArray(FirstMoveBlack, this.moveMappedArray);
        this.drawService.drawFromArray(arr2, 8);
        break;
      case '3':
        this.drawService.initHeatmap(120, .8, .1);
        this.activeHeatMapHeader = HeatmapTypes.third;
        const arr3 = this.moveService.createResultArray(LastMoveKingPosition, this.moveMappedArray);
        this.drawService.drawFromArray(arr3, 4);
        break;
    }
  }

  ngOnInit(): void {
    this.initChessBoard();

    this.moveMappedArray = this.moveService.createArrayFromAllPosibleMoves();
  }

}
