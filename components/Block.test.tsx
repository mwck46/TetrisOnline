import React from 'react';
import renderer from 'react-test-renderer';

import { create2dArray } from './helper.tsx';
import Block from './Block.tsx';

beforeEach(() => {
    var grid = create2dArray(20, 24);
})

test('block test', () => {
    const grid = create2dArray(20, 24);
    expect(grid.length).toBe(24);
    expect(grid[0].length).toBe(20);
});