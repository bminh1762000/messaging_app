import React from 'react';
import {StyleSheet, FlatList, Dimensions, PixelRatio} from 'react-native';

const Grid = ({renderItem, itemMargin, numColumns, ...otherProps}) => {
  const renderImageGrid = info => {
    const {index} = info;
    const {width} = Dimensions.get('window');

    const size = PixelRatio.roundToNearestPixel(
      (width - itemMargin * (numColumns - 1)) / numColumns,
    );
    const marginTop = index < numColumns ? 0 : itemMargin;
    const marginLeft = index % numColumns === 0 ? 0 : itemMargin;

    return renderItem({...info, size, marginLeft, marginTop});
  };

  return <FlatList {...otherProps} renderItem={renderImageGrid} />;
};

export default Grid;

Grid.defaultProps = {
  numColumns: 4,
  itemMargin: StyleSheet.hairlineWidth,
};
