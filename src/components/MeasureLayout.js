import React, {useState} from 'react';
import {StyleSheet, Platform, View, StatusBar} from 'react-native';

const MeasureLayout = ({children}) => {
  const [layoutState, setLayoutState] = useState(null);

  const handleLayout = event => {
    const {
      nativeEvent: {layout},
    } = event;
    const additionalHeight =
      Platform.OS === 'android' ? StatusBar.currentHeight : 0;
    setLayoutState({
      layoutState: {
        ...layoutState,
        y: layout.y + additionalHeight,
      },
    });
  };

  if (!layoutState) {
    return <View onLayout={handleLayout} style={styles.container} />;
  }

  return children(layoutState);
};

export default MeasureLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
