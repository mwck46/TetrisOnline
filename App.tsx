import React, { useState, useEffect, useCallback, } from 'react';
import { View, Text, TouchableOpacity, } from 'react-native';

class Block {
  orientation: number[][];
  currCoord: number[];
  constructor(orientation: number[][], initCoord: number[]) {
    this.orientation = orientation;
    this.currCoord = initCoord;
  }

  canTranslate(grid: number[][], currCoord: number[][]) {
    for (let p of currCoord) {
      if (p[0] >= grid.length) {
        console.log(p[0], p[1], grid.length);
        return false;
      }
    }
    return true;
  }

  drop(tetrisGrid: number[][]) {
    let newCoord = [...this.currCoord];
    newCoord[0]++;

    let tetrisGridClone = tetrisGrid.map((row) => { return [...row] })

    // remove old
    for (let p of this.orientation) {
      tetrisGridClone[this.currCoord[0] + p[0]][this.currCoord[1] + p[1]] = 0;
    }

    let points = []
    for (let p of this.orientation) {
      points.push([newCoord[0] + p[0], newCoord[1] + p[1]])
    }

    if (!this.canTranslate(tetrisGridClone, points)) {
      return null;
    }

    // draw new 
    for (let p of points) {
      tetrisGridClone[p[0]][p[1]] = 1;
    }

    this.currCoord = newCoord;
    return tetrisGridClone;
  }
}


const speed = 1000
const tetrisGridInit: number[][] = []
var nextBlock: Block;
const w = 30;
const h = 20;


export default function App() {
  const [tetrisGridMine, setTetrisGrid] = useState<number[][]>(tetrisGridInit);

  useEffect(() => {
    var grid1 = create2dArray(w, h);
    setTetrisGrid(grid1);
    generateNextBlock();

    console.log("start timer")
    setInterval(() => {
      tick();
    }, speed)
  }, []);

  const create2dArray = (width: number, height: number) => {
    var grid = [];
    var row = [];
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        row.push(0);
      }
      grid.push(row);
      row = [];
    }
    return grid;
  }

  const tick = () => {
    console.log("tick")
    setTetrisGrid(tetrisGridMine => {
      let tetrisGridClone = nextBlock.drop(tetrisGridMine);
      if (!tetrisGridClone) {
        console.log("cannot drop")
        return tetrisGridMine;
      }
      return tetrisGridClone;
    })
  }

  const generateNextBlock = () => {
    nextBlock = new Block(
      [[-1, 1], [-1, 0], [0, 0], [0, -1]],
      [1, w / 2]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'column', justifyContent: 'space-around', margin: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

          <View style={{ marginHorizontal: 35, alignItems: 'center', flexDirection: 'column' }}>

            <View style={{ backgroundColor: 'white' }}>
              {
                tetrisGridMine.map((row: number[], i: number) => {
                  return (
                    <View key={i} style={{ flexDirection: 'row' }}>
                      {row.map((cell, j) => {

                        console.log("cell");
                        return (
                          <TouchableOpacity key={j} >
                            <View style={[{
                              borderColor: 'black',
                              backgroundColor: cell == 0 ? "white" : "blue",
                              width: 15,
                              height: 15,
                              borderWidth: 1
                            }]}>
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  )
                })
              }
            </View>
          </View>

        </View>
      </View>
    </View>
  );
}

