import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getRandomInt, ColorCode, ColorTable, create2dArray } from "./helper"

const Cell = (props: any) => {
  const { color, size, borderWidth } = props;
  //console.log(color, size, borderWidth)
  const [colorStr, setColor] = useState<string>();

  console.log("cell")
  useEffect(() => {
    setColor(ColorTable.getColor(color!));
  }, [color]);

  return (
    <View style={[styles.cell, {
      // dynamic styles
      backgroundColor: colorStr,
      width: size,
      height: size,
      borderWidth: borderWidth
    }]}>
    </View>
  )

}

var styles = StyleSheet.create({
  cell: {
    borderColor: 'black',
  }

})

export default Cell;