import React, { useState, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Cell = (props: any) => {
  const { color, size, borderWidth } = props;
  //console.log(color, size, borderWidth)
  console.log("cell")

  return (
     <View style={[styles.cell, {
       // dynamic styles
       backgroundColor: color,
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