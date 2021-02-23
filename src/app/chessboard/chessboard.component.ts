import { Component, OnInit } from '@angular/core';
declare const Chessboard: any;
// @ts-ignore
import h337 from 'heatmap.js';
import {Point} from '../core/models/point';
import {MovePosition} from '../core/models/move-position';
import {SymbolicArr} from '../core/models/symbolic-arr';
import {symbArr} from '../core/data/symbolic-arr';
import {MovePositionMapped} from '../core/models/move-position-mapped';
import {FirstMoveWhite} from '../core/data/first-move-white-data';
import {FirstMoveBlack} from '../core/data/first-move-black-data';
import {LastMoveKingPosition} from '../core/data/last-move-king-position-data';
import {HeatmapTypes} from '../core/models/heatmap-types';
import {FenGames} from '../core/data/fen-games';

// @ts-ignore
import * as Chess from 'chess.js';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss']
})
export class ChessboardComponent implements OnInit {
  activeHeatMapHeader: HeatmapTypes | undefined;
  selectedOption = '1';
  heatmapPosition = 'absolute';
  points: Array<any> = [];
  heatmapInstance: h337;
  moveMappedArray: Array<any> = [];

  getPiecePositions = (game: any, piece: any) => {
    // @ts-ignore
    return [].concat(...game.board()).map((p, index) => {
      // @ts-ignore
      if (p !== null && p.type === piece.type && p.color === piece.color) {
        return index;
      }
    }).filter(Number.isInteger)
      .map((pieceIndex) => {
      // @ts-ignore
        const row = 'abcdefgh'[pieceIndex % 8];
      // @ts-ignore
        const column = Math.ceil((64 - pieceIndex) / 8);
        return row + column;
    });
  }

  constructor() {

  }

  generateJson() {
    let fen: string = '8/8/5pk1/3R2p1/r1r3P1/4bKB1/7N/8 w - - 0 58';
    let game = new Chess();
    var resArr: Array<any> = [];

    game.load(fen);
    const turn = game.turn();

    FenGames.map((x) => {
      let returnArr: Array<any> = [];

      let fen = x.fen;
      game.load(fen);
      const turn = game.turn();

      let kingPosition = this.getPiecePositions(game, {type: 'k', color: turn});

      let find = resArr.find((x: any) => {
        if (x.move.toString() == kingPosition.toString()){
          x.times++;
        }

        return x.move.toString() == kingPosition.toString();
      });

      if (!find) {
        let newObj = {move: kingPosition.toString(), times: 1};
        resArr.push(newObj);
      }
    });

    return JSON.stringify(resArr);
  }

  initChessBoard(): void {
    const board1 = Chessboard('board1', 'start');
  }

  initHeatmap(): h337 {
    return h337.create({
      radius: 60,
      maxOpacity: .8,
      minOpacity: .1,
      // only container is required, the rest will be defaults
      container: document.querySelector('.heatmap')
    });
  }

  createMoveMapperArray(): Array<MovePosition> {
    const returnArr = [];
    const arrLength: number = symbArr.length;

    for (let j = 0; j < arrLength; j++) {
      for (let i = 1; i < 9; i++) {
        const moveObj: MovePosition = new MovePosition();
        moveObj.move = symbArr[j] + i;
        moveObj.x = 35 + (80 * j);
        moveObj.y = 680 - (80 * i);

        returnArr.push(moveObj);
      }
    }

    return returnArr;
  }

  createMappedArray(entryArray: Array<any>, moveMappedArray: Array<any>): Array<MovePositionMapped> {
    const resultArr = [];

    for (const [index, val] of entryArray.entries()) {
      const move = entryArray[index].move;
      const times = entryArray[index].times;

      const mapped = moveMappedArray
        .find(
          (x) => x.move === move
        );

      if (mapped) {
        const obj = new MovePositionMapped;
        obj.move = mapped.move;
        obj.x = mapped.x;
        obj.y = mapped.y;
        obj.times = times;

        resultArr.push(obj);
      }
    }

    return resultArr;
  }

  drawFromArray(resultArr: Array<any>): void {
    for (const [index, val] of resultArr.entries()) {
      const point: Point = {
        x: Math.floor(resultArr[index].x),
        y: Math.floor(resultArr[index].y),
        value: resultArr[index].times / 40
      };

      this.points.push(point);
    }
  }

  changeHeatmapType(type: string): void {
    this.activeHeatMapHeader = HeatmapTypes.first;
  }

  changeHeatmap(): void {
    this.points = [];

    switch (this.selectedOption) {
      case '1':
        this.activeHeatMapHeader = HeatmapTypes.first;
        const arr = this.createMappedArray(FirstMoveWhite, this.moveMappedArray);
        this.drawFromArray(arr);
        break;
      case '2':
        this.activeHeatMapHeader = HeatmapTypes.second;
        const arr2 = this.createMappedArray(FirstMoveBlack, this.moveMappedArray);
        this.drawFromArray(arr2);
        break;
      case '3':
        this.activeHeatMapHeader = HeatmapTypes.third;
        const arr3 = this.createMappedArray(LastMoveKingPosition, this.moveMappedArray);
        this.drawFromArray(arr3);
        break;
    }

    const data = {
      max: 10,
      data: this.points
    };

    this.heatmapInstance.setData(data);
  }

  ngOnInit(): void {
    this.initChessBoard();
    this.heatmapInstance = this.initHeatmap();
    this.moveMappedArray = this.createMoveMapperArray();
  }

}
