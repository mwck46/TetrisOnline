
export class Block {
  currOrientationIdx: number;
  orientations: number[][][];
  currCoord: number[];
  color: number;
  constructor(orientations: number[][][], initCoord: number[], color: number) {
    this.currOrientationIdx = 0;
    this.orientations = orientations;
    this.currCoord = initCoord;
    this.color = color;

    console.log("Block l generated")
  }

  canRotate(tetrisGrid: number[][], points: number[][]) {
    return true;
  }

  // No need to clone the tetrisGrid before pass it here
  rotate(tetrisGrid: number[][]) {
    // temp update 
    let nextOrientationIdx = this.currOrientationIdx + 1;
    if (nextOrientationIdx === this.orientations.length) {
      nextOrientationIdx = 0;
    }

    let tetrisGridClone = tetrisGrid.map((row) => { return [...row] })

    // remove old 
    for (let p of this.orientations[this.currOrientationIdx]) {
      const rowIdx = this.currCoord[0] + p[0];
      const colIdx = this.currCoord[1] + p[1];
      tetrisGridClone[rowIdx][colIdx] = 0;
    }

    // get new points
    let points = []
    for (let p of this.orientations[nextOrientationIdx]) {
      const rowIdx = this.currCoord[0] + p[0];
      const colIdx = this.currCoord[1] + p[1];
      points.push([rowIdx, colIdx])
    }

    // check
    if (!this.canRotate(tetrisGridClone, points)) {
      return tetrisGrid;
    }

    // draw new 
    for (let p of points) {
      tetrisGridClone[p[0]][p[1]] = this.color;
    }

    // confirm change
    this.currOrientationIdx = nextOrientationIdx;
    return tetrisGridClone;
  }

  canShift() {

  }

  shift() {

  }

  canDrop(tetrisGrid: number[][], points: number[][]) {
    for (let p of points) {
      if(p[0] >= tetrisGrid.length){
        console.log(p[0], p[1], tetrisGrid.length);
        return false;
      }else if(p[1] >= tetrisGrid[0].length || p[1] < 0){
        console.log(p[0], p[1], tetrisGrid.length);
        return false;
      }else if(tetrisGrid[p[0]][p[1]] > 0){
        console.log(p[0], p[1], tetrisGrid[p[0]][p[1]]);
        return false;
      }
    }
    return true;
  }

  // direction: 'down', 'left', 'right'
  translate(tetrisGrid: number[][], direction: string) {
    // temp update 
    let newCoord = [...this.currCoord]; // IMPORTANT to make a copy!
    if(direction === 'down'){
      newCoord[0]++;
    }else if(direction === 'left'){
      newCoord[1]--;
    }else if(direction === 'right'){
      newCoord[1]++;
    }

    let tetrisGridClone = tetrisGrid.map((row) => { return [...row] })

    // remove old
    for (let p of this.orientations[this.currOrientationIdx]) {
      const rowIdx = this.currCoord[0] + p[0];
      const colIdx = this.currCoord[1] + p[1];
      tetrisGridClone[rowIdx][colIdx] = 0;
    }

    // get new points
    let points = []
    for (let p of this.orientations[this.currOrientationIdx]) {
      const rowIdx = newCoord[0] + p[0];
      const colIdx = newCoord[1] + p[1];
      //console.log(x, y)
      points.push([rowIdx, colIdx])
    }

    if (!this.canDrop(tetrisGridClone, points)) {
      return null;
    }

    // draw new 
    for (let p of points) {
      //console.log(p)
      tetrisGridClone[p[0]][p[1]] = this.color;
    }

    // confirm change
    this.currCoord = newCoord;
    return tetrisGridClone;
  }
}

export class TetrisBlockFactory {
  generateBlock(blockType: string, initCoord: number[]) {
    if (blockType === 'l') {
      const orientations = [
        [[2, 0], [1, 0], [0, 0], [-1, 0]],
        [[0, -1], [0, 0], [0, +1], [0, +2]],
        [[1, 0], [0, 0], [-1, 0], [-2, 0]],
        [[0, -2], [0, -1], [0, 0], [0, +1]],
      ]
      const color = 1;
      const b = new Block(orientations, initCoord, color);
      return b;
    } else if (blockType === 'L') {
      const orientations = [
        [[2, 0], [1, 0], [0, 0], [0, 1]],
        [[-1, 0], [0, 0], [0, 1], [0, 2]],
        [[-2, 0], [-1, 0], [0, 0], [0, -1]],
        [[0,-2], [0, -1], [0, 0], [+1, 0]],
      ]
      const color = 2;
      const b = new Block(orientations, initCoord, color);
      return b;
    } else if (blockType === 'J') {
      const orientations = [
        [[2, 0], [1, 0], [0, 0], [0, -1]],
        [[1, 0], [0, 0], [0, 1], [0, 2]],
        [[0, 1], [0, 0], [-1, 0], [-2, 0]],
        [[0, -2], [0, -1], [0, 0], [-1, 0]],
      ]
      const color = 3;
      const b = new Block(orientations, initCoord, color);
      return b;
    } else if (blockType === 'o') {
      const orientations = [
        [[1, 1], [1, 0], [0, 0], [0, 1]],
      ]
      const color = 4;
      const b = new Block(orientations, initCoord, color);
      return b;
    } else {
      const orientations = [
        [[2, 0], [1, 0], [0, 0], [-1, 0]],
        [[0, -1], [0, 0], [0, +1], [0, +2]],
        [[1, 0], [0, 0], [-1, 0], [-2, 0]],
        [[0, -2], [0, -1], [0, 0], [0, +1]],
      ]
      const color = 1;
      const b = new Block(orientations, initCoord, color);
      return b;
    }

  }
} 