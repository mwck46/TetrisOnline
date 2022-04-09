import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, TextInput, Modal, TouchableOpacity, ScrollView } from 'react-native';
import uuid from 'react-native-uuid';
import Constants from "expo-constants";

import Cell from "./Cell"
import { GameMessage } from "./GameMessage"
import { getRandomInt, ColorCode, ColorTable, create2dArray } from "./helper"

import { Block, TetrisBlockFactory } from "./Block"
import PreviewPanel from './PreviewPanel';

const { manifest } = Constants;
const characterId = uuid.v4().toString();
var url = ""
if (!manifest?.debuggerHost) {
  url = 'ws://localhost:18080';
} else {
  url = `ws://${manifest.debuggerHost.split(':').shift()}:18080`;
}
// Don't put websocket instance inside App, bcz everything inside will 
// be constantly refreshed, thus many connection will be created
var ws: WebSocket;


const CELL_SIZE = 15
const tetrisGridInit: number[][] = []
var nextBlock: Block;

const GamePanel = (props: any) => {
  const { w, h } = props;
  const [tetrisGridMine, setTetrisGrid] = useState<number[][]>(tetrisGridInit);
  const [tetrisGridOpponent, setTetrisGridOpponent] = useState<number[][]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(true);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [serverMessages, setServerMessages] = useState<string[]>([]);
  const [nextBlockQueue, setNextBlockQueue] = useState<number[]>([-1,-1,-1,-1]);
  //const [nextBlock, setNextBlock] = useState<Block>();
  const [speed, setSpeed] = useState(700);
  const [gameId, setGameId] = useState('');
  var timer: NodeJS.Timer;
  const fact = new TetrisBlockFactory();

  // React hook equivalent to componentDidMount
  // https://stackoverflow.com/a/54655508/9265852
  useEffect(() => {
    var grid1 = create2dArray(w, h);
    setTetrisGrid(grid1);

    var grid2 = create2dArray(w, h);
    setTetrisGridOpponent(grid2);

    ws = new WebSocket(url);
    console.log("ws = ", ws)

    ws.onopen = () => {
      const serverMessagesList: string[] = [];
      serverMessagesList.push('Connected')
      setServerMessages(serverMessages => [...serverMessages, ...serverMessagesList])
    };
    ws.onclose = (e) => {
      const serverMessagesList: string[] = [];
      serverMessagesList.push('Disconnected')
      setServerMessages(serverMessages => [...serverMessages, ...serverMessagesList])
    };
    ws.onerror = (e: Event) => {
      const serverMessagesList: string[] = [];
      const msg = (e as WebSocketErrorEvent).message
      setServerMessages(serverMessages => [...serverMessages, ...serverMessagesList])
    };
    ws.onmessage = (e) => {
      const serverMessagesList: string[] = [];
      serverMessagesList.push(e.data)

      //console.log(e.data)
      const msgObj = GameMessage.parseFromSocket(e.data)
      //console.log(msgObj)

      if (msgObj.sender === "SERVER") {
        if (msgObj.message === "GAMEID") {
          setGameId(msgObj.remarks);
          setIsGameOver(false);
        } else if (msgObj.message === "JOINGAME") {
          if (msgObj.remarks === "OK") {
            setIsGameOver(false);
          } else {
            serverMessagesList.push("Cannot join game")
          }
        } else if (msgObj.message === "GAMESTART") {
          const nextNBlocks: number[] = JSON.parse(msgObj.remarks)
          console.log("game start")
          console.log(nextNBlocks)
          setNextBlockQueue(nextBlockQueue => [...nextBlockQueue, ...nextNBlocks]);
          startGame();
          serverMessagesList.push("Game start")
        } else if (msgObj.message === "NEWBLOCK") {
          const nextNBlocks: number[] = JSON.parse(msgObj.remarks)
          setNextBlockQueue(nextBlockQueue => [...nextBlockQueue, ...nextNBlocks]);
          serverMessagesList.push("received new block")
        } else if (msgObj.message === "ERROR") {
          serverMessagesList.push(`[Error] ${msgObj.remarks}`)
        }

      } else if (msgObj.sender === "RIVAL") {
        if (msgObj.message === "TICK") {
          const newOpponentTetrisGrid = JSON.parse(msgObj.remarks)
          setTetrisGridOpponent(newOpponentTetrisGrid)
        }
      }
      else {
      }

      setServerMessages(serverMessages => [...serverMessages, ...serverMessagesList])
    };
  }, []);

  useEffect(() => {
    if (!gameId || !ws) {
      return
    }
    if (nextBlockQueue.length < 20) {
      const msg = new GameMessage(characterId, "REQUESTBLOCK", gameId).toString();
      ws.send(msg)
    }
  }, [nextBlockQueue]);

  const requestGameStart = () => {
    const msg = new GameMessage(characterId, "REQUESTSTART", gameId).toString();
    ws.send(msg)
  }

  const startGame = () => {
    if (!timer) {
      clearInterval(timer);
    }

    generateNextBlock();
    timer = setInterval(() => {
      // Make sure tick receive the latest tetrisGrid value
      setTetrisGrid(grid => {
        const newGrid = tick(grid, nextBlock)
        // send your current grid to your opponent
        const msg = new GameMessage(characterId, "TICK", JSON.stringify(newGrid)).toString();
        ws.send(msg);
        return newGrid;
      })
    }, speed)
  }


  const tryAgain = () => {
    setMyScore(0)
    setOpponentScore(0)
    setIsGameOver(false)

    var grid1 = create2dArray(w, h);
    setTetrisGrid(grid1);
    var grid2 = create2dArray(w, h);
    setTetrisGridOpponent(grid2);
    startGame();
  }

  const tick = (grid: number[][], nextBlock: Block) => {
    //console.log("tick")

    //let tetrisGridClone = grid.map( (row) => {return [...row]} )

    let tetrisGridClone = nextBlock?.translate(grid, 'down');
    if (!tetrisGridClone) {
      console.log("cannot drop")
      grid = turnBlockToGray(grid);
      grid = clearOutGrid(grid);
      checkIfIsGameOver(grid);
      generateNextBlock();
      tetrisGridClone = grid;
    }

    return tetrisGridClone;
  }

  const turnBlockToGray = (grid: number[][]) => {
    for (let p of nextBlock.orientations[nextBlock.currOrientationIdx]) {
      var rowIdx = nextBlock.currCoord[0] + p[0];
      var colIdx = nextBlock.currCoord[1] + p[1];
      console.log(rowIdx, colIdx, grid[rowIdx][colIdx]);
      grid[rowIdx][colIdx] = ColorCode.Gray;
    }
    return grid;
  }

  const clearOutGrid = (grid: number[][]) => {
    let clearRow = [];
    for (let p of nextBlock.orientations[nextBlock.currOrientationIdx]) {
      var rowIdx = nextBlock.currCoord[0] + p[0];
      let canClear = true;
      for (let i = 0; i < w; i++) {
        if (grid[rowIdx][i] === ColorCode.White) {
          canClear = false;
          break;
        }
      }
      if (canClear && clearRow.indexOf(rowIdx) === -1) {
        clearRow.push(rowIdx);
      }
    }
    if (clearRow.length > 0) {
      for (let p of clearRow.sort()) {
        grid = removeRow(grid, p);
      }
    }
    return grid;
  }

  const checkIfIsGameOver = (grid: number[][]) => {
    if (grid[0][5] === ColorCode.Gray) {
      setIsGameOver(true);
    }
  }

  const generateNextBlock = () => {
    setNextBlockQueue(nextBlockQueue => {
      //console.log(nextBlockQueue)
      let blkType = nextBlockQueue.shift();
      //console.log("nexblock = ", blkType)
      //console.log(nextBlockQueue)
      nextBlock = fact.generateBlock(
        TetrisBlockFactory.blockTypes[(blkType) ? blkType : 0],
        [1, w / 2]
      );
      return [...nextBlockQueue]
    });
  }

  const removeRow = (grid: number[][], index: number) => {
    var row = [];
    for (let j = 1; j <= w; j++) {
      var cell = 0;
      row.push(cell);
    }
    grid.splice(index, 1);
    grid.unshift(row);
    return grid;
  }

  const renderCells = (grid: number[][]) => {
    // console.log('renderCells');

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
                  <Cell key={i + ',' + j} color={'white'} size={CELL_SIZE} />
                </TouchableOpacity>
              )
            })}
          </View>
        )
      } else {
        return (
          <View key={i} style={{ flexDirection: 'row' }}>
            {row.map((cell, j) => {
              let color = ColorTable.getColor(cell)
              return (
                <TouchableOpacity key={j} >
                  <Cell key={i + ',' + j} borderWidth={1} color={color} size={CELL_SIZE} />
                </TouchableOpacity>
              )
            })}
          </View>
        )
      }
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

  const registerNewGame = () => {
    const msg = new GameMessage(characterId, "NEWGAME").toString();
    //console.log(msg)
    ws.send(msg)
  }

  const joinGame = (gameId: string) => {
    ws.send(new GameMessage(characterId, "JOINGAME", gameId).toString())
  }

  const renderStart = () => {
    return (
      <Modal
        animationType={"slide"}
        // transparent={true}
        visible={isGameOver}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.5)' }}>
          <Text style={{ fontSize: 64, fontWeight: '800' }}>
            <Text style={{ color: 'blue' }}>T</Text>
            <Text style={{ color: 'orange' }}>E</Text>
            <Text style={{ color: 'yellow' }}>T</Text>
            <Text style={{ color: 'green' }}>R</Text>
            <Text style={{ color: 'red' }}>I</Text>
            <Text style={{ color: 'cyan' }}>S</Text>
          </Text>

          <TouchableOpacity onPress={() => registerNewGame()}>
            <Text style={{ fontSize: 32, color: 'white', fontWeight: '500' }}>
              Host Game
            </Text>
          </TouchableOpacity>


          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', }}>
            <TouchableOpacity onPress={() => joinGame(gameId)}>
              <Text style={{ fontSize: 32, color: 'white', fontWeight: '500', }}>
                Join
              </Text>
            </TouchableOpacity>
            <TextInput style={styles.modelTextInput}
              value={gameId}
              placeholder="Game ID..."
              onChangeText={newText => setGameId(newText)}
            >
            </TextInput>

          </View>

        </View>
      </Modal>
    )
  }

  return (
    <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>

      <View style={{ paddingTop: 10, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: '700', fontSize: 26 }}>TETRIS ONLINE </Text>
        <Text style={{ fontWeight: '700', fontSize: 26 }}> GAME ID = {gameId}</Text>
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

        <View style={{ marginHorizontal: 35, alignItems: 'center', flexDirection: 'column' }}>
          <PreviewPanel nextBlockQueue={nextBlockQueue} />
          <TouchableOpacity onPress={() => requestGameStart()} >
            <Text style={{ fontSize: 16, fontWeight: '500', borderWidth: 3, }}>
              {'START'}
            </Text>
          </TouchableOpacity>
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


        <View style={styles.logger}>
          <ScrollView style={{ width: 300, height: 300 }}>
            {
              serverMessages.map((item, ind) => {
                return (
                  <Text key={ind}>
                    {item}
                  </Text>
                )
              })
            }
          </ScrollView>
        </View>

      </View>

      {renderStart()}
    </View>
  );

}

const styles = StyleSheet.create({
  img: {
    width: 50,
    height: 50
  },
  modelTextInput: {
    marginHorizontal: 10,
    fontSize: 32,
    borderWidth: 3,
    height: 'auto',
  },
  logger: {
    backgroundColor: '#ffeece',
    flexGrow: 1,
    borderWidth: 3,
    marginHorizontal: 10,
    display: 'none'
  },
});


export default GamePanel;