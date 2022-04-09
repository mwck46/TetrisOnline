import { View, StyleSheet, Text } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

import Cell from './Cell';
import { Block, TetrisBlockFactory } from './Block'
import { Color } from "./helper"

const factory = new TetrisBlockFactory();
var blk: Block;
const CELL_SIZE = 10

const PreviewBlock = (props: any) => {
  const { blkType } = props;
  const [prevGrid, setGrid] = useState<number[][]>([]);

  useEffect(() => {
    blk = factory.generateBlock(TetrisBlockFactory.blockTypes[blkType], [2, 2])
    let grid = createBlockGrid();
    grid = blk?.drawBlock(grid);
    setGrid(grid);
  }, [blkType]);

  const createBlockGrid = () => {
    const width: number = 6;
    const height: number = 6;
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

  const renderBlockGrid = (grid: number[][]) => {
    return (
      <View style={{ borderWidth: 1 }}>
        {
          grid.map((row, i) => {
            return (
              <View key={i} style={{ flexDirection: 'row' }}>
                {row.map((cell, j) => {
                  var color = 'white';
                  if (cell == Color.Blue) {
                    color = 'blue';
                  } else if (cell == Color.Green) {
                    color = 'green';
                  } else if (cell == 3) {
                    color = 'orange';
                  } else if (cell == 4) {
                    color = 'yellow';
                  } else if (cell == 5) {
                    color = 'purple';
                  } else if (cell == Color.Gray) {
                    color = 'gray';
                  }

                  return (
                    <Cell key={i + ',' + j} borderWidth={0} color={color} size={CELL_SIZE} />
                  )
                })}
              </View>
            )
          })
        }
      </View>
    )
  }

  return (
    <View style={{ marginBottom: 10 }}>
      {renderBlockGrid(prevGrid)}
    </View>
  )

}


export default PreviewBlock; 