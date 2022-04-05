
export class Block{
  currOrientationIdx : number;
  orientations: number[][][];
  currCoord: number[];
  color: number;
  constructor(orientations: number[][][], initCoord: number[], color: number){
    this.currOrientationIdx = 0;
    this.orientations = orientations;
    this.currCoord = initCoord;
    this.color = color;

    console.log("Block l generated")
  }

  canRotate(tetrisGrid: number[][], points: number[][]){
    return true;
  }

  // No need to clone the tetrisGrid before pass it here
  rotate(tetrisGrid: number[][]){
    // temp update 
    let nextOrientationIdx = this.currOrientationIdx + 1;
    if(nextOrientationIdx === this.orientations.length){
      nextOrientationIdx = 0;
    }

    let tetrisGridClone = tetrisGrid.map( (row) => {return [...row]} )
    
    // remove old 
    console.log(tetrisGridClone)
    for(let p of this.orientations[this.currOrientationIdx]){
      const x = this.currCoord[0] + p[0];
      const y = this.currCoord[1] + p[1];
      tetrisGridClone[x][y] = 0;
    }

    // get new points
    const points = this.orientations[nextOrientationIdx]
    if(!this.canRotate(tetrisGridClone, points)){
      return tetrisGrid;
    }

    // draw new 
    for(let p of points){
      const x = this.currCoord[0] +  p[0];
      const y = this.currCoord[1] +  p[1];
      tetrisGridClone[x][y] = this.color;
    }

    // confirm change
    this.currOrientationIdx = nextOrientationIdx;
    return tetrisGridClone;
  }
  
  canShift(){

  }

  shift(){

  }

  canDrop(){
    return true;
  }

  drop(){
    // temp update 
    const newCoord = this.currCoord;
    newCoord[1]++
    
    // remove old

    
    // get new points

    if(!this.canDrop()){

    }
   

    // draw new 

    // update
  }
} 

export class TetrisBlockFactory{
  generateBlock(blockType: string, initCoord: number[]){
    if(blockType === 'l'){
      const orientations = [
        [[2,0], [1,0], [0,0], [-1,0]],
        [[0,-1], [0,0], [0,+1], [0,+2]],
        [[1,0], [0,0], [-1,0], [-2,0]],
        [[0,-2], [0,-1], [0,0], [0,+1]],
      ]
      const color = 1;
      const b = new Block(orientations, initCoord, color);
      return b;
    }else{
      const orientations = [
        [[2,0], [1,0], [0,0], [-1,0]],
        [[0,-1], [0,0], [0,+1], [0,+2]],
        [[1,0], [0,0], [-1,0], [-2,0]],
        [[0,-2], [0,-1], [0,0], [0,+1]],
      ]
      const color = 1;
      const b = new Block(orientations, initCoord, color);
      return b;
    }

  }
} 