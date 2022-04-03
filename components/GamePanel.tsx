import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, Modal, TouchableOpacity } from 'react-native';

import Cell from "./Cell"

const GamePanel = (props: any) => {
  const { w, h } = props;
  const [tetrisGrid, setGrid] = useState<number[][]>([]);

  // React hook equivalent to componentDidMount
  // https://stackoverflow.com/a/54655508/9265852
  useEffect(() => {
    createGrid();
  }, []);


  const createGrid = () => {
    console.log("createGrid()")

    var grid = []; var row = [];
    var row = [];

    for (let i = 1; i <= h; i++) {
      for (let j = 1; j <= w; j++) {
        var cell = 0;
        row.push(cell);
      }
      grid.push(row);
      row = [];
    }
    setGrid(grid);
  }

  const renderCells = () => {
    //console.log('renderCells');
    const cellSize = 15

    // Array.prototype.map(), create new array by populate the results 
    // of calling a provided function on every element in the calling array.
    return tetrisGrid.map((row, i) => { // row: each row of grid, i: row number
      // console.log(row, i)

      // 4 invisible rows on top of the visible grid
      if (i < 4) {
        return (
          <View key={i} style={{ height: 0, flexDirection: 'row' }}>
            {row.map((cell, j) => {
              return (
                <TouchableOpacity key={j}>
                  <Cell key={i + ',' + j} color={'white'} size={cellSize} />
                </TouchableOpacity>
              )
            })}
          </View>
        )
      }

      return (
        <View key={i} style={{ flexDirection: 'row' }}>
          {row.map((cell, j) => {
            // console.log('color is:', cell)
            var color = 'white';
            if (cell == 1) {
              color = 'blue';
            } else if (cell == 2) {
              color = 'green';
            }

            if (i < 4) {
              color = 'red';
            }

            return (
              <TouchableOpacity key={j} >
                <Cell key={i + ',' + j} borderWidth={1} color={color} size={cellSize} />
              </TouchableOpacity>
            )
          })}
        </View>
      )
    })
  }

  return (
    <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>

      <View style={{ paddingTop: 40, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: '700', fontSize: 26 }}>TETRIS ONLINE</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <View style={{ paddingTop: 10, flexDirection: 'column', alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>Opponent</Text>
          </View>
          <View style={{ backgroundColor: 'white' }}>
            {renderCells()}
          </View>
        </View>

        <View style={{ marginHorizontal: 35,  alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>NEXT</Text>
        </View>

        <View style={{ paddingTop: 10, flexDirection: 'column', alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>You</Text>
          </View>
          <View style={{ backgroundColor: 'white' }}>
            {renderCells()}
          </View>
        </View>


      </View>

    </View>
  );

}

const styles = StyleSheet.create({
  img: {
    width: 50,
    height: 50
  }
});


export default GamePanel;