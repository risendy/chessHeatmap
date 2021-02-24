import { Injectable } from '@angular/core';
import {MovePosition} from '../models/move-position';
import {symbArr} from '../data/symbolic-arr';
import {MovePositionMapped} from '../models/move-position-mapped';
import {FenGames} from '../data/fen-games';
import {FenCaptures} from '../data/fen-captures';
// @ts-ignore
import * as Chess from 'chess.js';
import {FenEnpassant} from '../data/fen-enpassant';

@Injectable({
  providedIn: 'root'
})
export class MoveServiceService {
  constructor() { }

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

  createArrayFromAllPosibleMoves(): Array<MovePosition> {
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

  createResultArray(entryJsonArray: Array<any>, allPosibleMovesArray: Array<any>): Array<MovePositionMapped> {
    const resultArr = [];

    for (const [index, val] of entryJsonArray.entries()) {
      let move = entryJsonArray[index].move;

      if (move[0] === move[0].toUpperCase()) {
          move = move.substring(1);
      }

      const times = entryJsonArray[index].times;

      const mapped = allPosibleMovesArray
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

  generateJsonFromCaptureArray(): string {
    let game = new Chess();
    var resArr: Array<any> = [];

    FenCaptures.map((y) => {
      let cutMove = y.move_san.substring(2);

      if (cutMove[0] === 'x') {
        cutMove = cutMove.substring(1);
      }

      if (cutMove.slice(-1) === '+' || cutMove.slice(-1) === '#') {
          cutMove = cutMove.slice(0, -1);
      }

      let find = resArr.find((x: any) => {
        if (x.move.toString() == cutMove){
          x.times++;
        }

        return x.move.toString() == cutMove.toString();
      });

      if (!find) {
        let newObj = {move: cutMove, times: 1};
        resArr.push(newObj);
      }
    })

    resArr.sort((a, b) => {
      return parseFloat(b.times) - parseFloat(a.times);
    });

    return JSON.stringify(resArr);
  }

  generateJsonFromFenArray(): string {
    let game = new Chess();
    var resArr: Array<any> = [];

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

    resArr.sort((a, b) => {
      return parseFloat(b.times) - parseFloat(a.times);
    });

    return JSON.stringify(resArr);
  }
}
