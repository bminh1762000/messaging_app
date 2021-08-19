/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import Grid from './Grid';

const keyExtractor = ({uri}) => uri;

const ImageGrid = ({onPressImage}) => {
  const [images, setImages] = useState([]);
  let loading = true;
  let cursor = null;

  const renderItem = ({item: {uri}, size, marginLeft, marginTop}) => {
    const style = {
      width: size,
      height: size,
      marginLeft,
      marginTop,
    };
    return (
      <TouchableOpacity
        key={uri}
        activeOpacity={0.75}
        onPress={() => onPressImage(uri)}
        style={style}>
        <Image source={{uri}} style={styles.image} />
      </TouchableOpacity>
    );
  };

  const getImages = async after => {
    if (loading) {
      return;
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (granted !== PermissionsAndroid.RESULTS.CAMERA) {
      console.log('Camera roll permission denied');
      return;
    }

    loading = true;

    const results = await CameraRoll.getPhotos({
      first: 20,
      after,
    });

    const {
      edges,
      page_info: {has_next_page, end_cursor},
    } = results;

    const loadedImage = edges.map(item => item.node.image);

    setImages(
      preImages => preImages.concat(loadedImage),
      () => {
        loading = false;
        cursor = has_next_page ? end_cursor : null;
      },
    );
  };

  const getNextImages = () => {
    if (loading) {
      return;
    }
    getImages(cursor);
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <Grid
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={getNextImages}
    />
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});
