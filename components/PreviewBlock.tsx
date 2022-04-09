import { View, StyleSheet, Text } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

import Cell from './Cell';
import { Block, TetrisBlockFactory } from './Block'
import { ColorCode, ColorTable, create2dArray } from "./helper"

const factory = new TetrisBlockFactory();
var blk: Block;
const CELL_SIZE = 10

const PreviewBlock = (props: any) => {
  const { blkType } = props;
  const [prevGrid, setGrid] = useState<number[][]>([]);

  useEffect(() => {
    blk = factory.generateBlock(TetrisBlockFactory.blockTypes[blkType], [2, 2])
    let grid = create2dArray(6, 6);
    grid = blk?.drawBlock(grid);
    setGrid(grid);
  }, [blkType]);

  const renderBlockGrid = (grid: number[][]) => {
    return (
      <View style={{ borderWidth: 1 }}>
        {
          grid.map((row, i) => {
            return (
              <View key={i} style={{ flexDirection: 'row' }}>
                {row.map((cell, j) => {
                  let color = ColorTable.getColor(cell)

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
    <View style={{ marginBottom: 5 }}>
      {renderBlockGrid(prevGrid)}
    </View>
  )

}


export default PreviewBlock; 