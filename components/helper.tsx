

export function getRandomInt(min: number = 0, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export class Color {
    static White = 0;
    static Blue = 1;
    static Green = 2;
    static Orange = 3;
    static Yellow = 4;
    static Purple = 5;
    static Gray = 10;
}