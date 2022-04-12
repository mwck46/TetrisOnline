import React from 'react';
import renderer from 'react-test-renderer';

import { getRandomInt, create2dArray } from './helper.tsx';

test('has random int', () => {
    expect(getRandomInt(1, 2)).toBeTruthy();
});

test('smaller than max', () => {
    expect(getRandomInt(1, 100) <= 100).toBeTruthy();
});

test('larger than max', () => {
    expect(getRandomInt(1, 100) >= 1).toBeTruthy();
});

test('2d array is within bound', () => {
    const grid = create2dArray(20, 24);
    expect(grid.length).toBe(24);
    expect(grid[0].length).toBe(20);
});