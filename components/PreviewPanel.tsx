import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import PrevewBlock from './PreviewBlock';

const PreviewPanel = (props: any) => {
  const { nextBlockQueue } = props;
  const [visBlockQueue, setVisBlockQueue] = useState<number[]>([]);

    useEffect( () => {
      setVisBlockQueue(visBlockQueue => [...nextBlockQueue.slice(0,4)])
    }, [nextBlockQueue])

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>NEXT</Text>
      {
        visBlockQueue.map((blockType: number, idx: number) => {
          return (
          <PrevewBlock key={"prevPan_" + idx} blkType={blockType} />
          )
        })
      }
    </View>
  )
}

export default PreviewPanel;