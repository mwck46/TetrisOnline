

export function getRandomInt(min: number = 0, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function create2dArray(width: number, height: number) {
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

export enum ColorCode {
    White = 0,
    BLK_s = 1,
    BLK_z = 2,
    BLK_T = 3,
    BLK_l = 4,
    BLK_L = 5,
    BLK_J = 6,
    BLK_o = 7,
    Gray = 10,
}

export class ColorTable {
    static table = new Map([
        [0, "white"],
        [1, "blue"],
        [2, "green"],
        [3, "orange"],
        [4, "magenta"],
        [5, "purple"],
        [6, "red"],
        [7, "aqua"],
        [10, "gray"],
    ]);

    static getColor(colorCode: ColorCode) {
        return ColorTable.table.get(colorCode)
    }

}