import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Cell from "./Cell"
import { getRandomInt, ColorCode, ColorTable, create2dArray } from "./helper"
const CELL_SIZE = 15

const Grid = (props: any) => {
  const { grid } = props;
  const [tetrisGrid, setGrid] = useState(grid);
  console.log('render grid', Date.now());

  // Array.prototype.map(), create new array by populate the results 
  // of calling a provided function on every element in the calling array.
  useEffect(() => {
    setGrid(grid);
  }, [grid]);


  return tetrisGrid.map((row: number[], i: number) => { // row: each row of grid, i: row number
    // console.log(row, i)

    // 4 invisible rows on top of the visible grid
    if (i < 4) {
      return (
        <View key={i} style={{ height: 0, flexDirection: 'row' }}>
          {row.map((cell: number, j: number) => {
            return (
              <TouchableOpacity key={j}>
                <Cell key={i + ',' + j} color={0} size={CELL_SIZE} />
              </TouchableOpacity>
            )
          })}
        </View>
      )
    } else {
      return (
        <View key={i} style={{ flexDirection: 'row' }}>
          {row.map((cell, j) => {
            return (
              <TouchableOpacity key={j} >
                <Cell key={i + ',' + j} borderWidth={1} color={cell} size={CELL_SIZE} />
              </TouchableOpacity>
            )
          })}
        </View>
      )
    }
  })


}

var styles = StyleSheet.create({
  cell: {
    borderColor: 'black',
  }

})

export default Grid;