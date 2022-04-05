import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, Modal, TouchableOpacity } from 'react-native';

import Cell from "./Cell"
import { getRandomInt } from "./helper"
import { Block, TetrisBlockFactory } from "./Block"

const tetrisGridInit: number[][] = []
const blockTypes: string[] = ["L" /*"l", "L", "J", "o", "s", "z",  "T"*/]
var nextBlock: Block;

const GamePanel = (props: any) => {
  const { w, h } = props;
  const [tetrisGridMine, setTetrisGrid] = useState<number[][]>(tetrisGridInit);
  const [tetrisGridOpponent, setTetrisGridOpponent] = useState<number[][]>([]);
  //const [nextBlock, setNextBlock] = useState<Block>();
  const [speed, setSpeed] = useState(500);
  var timer: NodeJS.Timer;
  const fact = new TetrisBlockFactory();

  // React hook equivalent to componentDidMount
  // https://stackoverflow.com/a/54655508/9265852
  useEffect(() => {
    var grid1 = createGrid();
    setTetrisGrid(grid1);

    var grid2 = createGrid();
    setTetrisGridOpponent(grid2);

    generateNextBlock();
    startGame();
  }, []);

  const startGame = () => {
    if (!timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      // Make sure tick receive the latest tetrisGrid value
      setTetrisGrid(grid => { return tick(grid, nextBlock) })
    }, speed)
  }

  const tick = (grid: number[][], nextBlock: Block) => {
    //console.log("tick")

    //let tetrisGridClone = grid.map( (row) => {return [...row]} )

    let tetrisGridClone = nextBlock?.translate(grid, 'down');
    if (!tetrisGridClone) {
      console.log("cannot drop")
      generateNextBlock();
      tetrisGridClone = grid;
    }

    return tetrisGridClone;
  }

  const generateNextBlock = () => {
    //setNextBlock(nextBlock => { return fact.generateBlock("l", [10,w/2])})
    
    nextBlock = fact.generateBlock(
      blockTypes[getRandomInt(0, blockTypes.length)], 
      [1, w / 2]
      );
  }


  const createGrid = () => {
    //console.log("createGrid()")

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

    return grid;
  }

  const renderCells = (grid: number[][]) => {
    console.log('renderCells');
    const cellSize = 15

    // Array.prototype.map(), create new array by populate the results 
    // of calling a provided function on every element in the calling array.
    return grid.map((row, i) => { // row: each row of grid, i: row number
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
            } else if (cell == 3) {
              color = 'orange';
            } else if (cell == 4) {
              color = 'yellow';
            } else if (cell == 5) {
              color = 'purple';
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

  const shiftCells = (grid: number[][], direction: string) => {
    let tetrisGridClone = nextBlock?.translate(grid, direction);
    if (!tetrisGridClone) {
      console.log("cannot shift")
      return
    }
    setTetrisGrid(tetrisGridClone)
  }

  const rotateCells = () => {
    console.log("rotate")
    let tetrisGridClone = nextBlock?.rotate(tetrisGridMine);
    if (!tetrisGridClone) {
      console.log("cannot rotate")
      return
    }
    setTetrisGrid(tetrisGridClone)
  }

  return (
    <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>

      <View style={{ paddingTop: 10, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: '700', fontSize: 26 }}>TETRIS ONLINE</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => shiftCells(tetrisGridMine, 'left')}>
            <Image style={styles.img} source={require('../assets/left.jpg')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shiftCells(tetrisGridMine, 'right')}>
            <Image style={styles.img} source={require('../assets/right.jpg')} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingTop: 10, flexDirection: 'column', alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>Opponent</Text>
          </View>
          <View style={{ backgroundColor: 'white' }}>
            {renderCells(tetrisGridOpponent)}
          </View>
        </View>

        <View style={{ marginHorizontal: 35, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>NEXT</Text>
        </View>

        <View style={{ paddingTop: 10, flexDirection: 'column', alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>You</Text>
          </View>
          <View style={{ backgroundColor: 'white' }}>
            {renderCells(tetrisGridMine)}
          </View>
        </View>

        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => rotateCells()}>
            <Image style={styles.img} source={require('../assets/rotate.png')} />
          </TouchableOpacity>
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