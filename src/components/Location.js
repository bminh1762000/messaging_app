import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Location = () => {
  const [geoLocation, setGeoLocation] = useState({
    coords: null,
    error: null,
  });

  const handleChange = location => {
    setGeoLocation({...geoLocation, coords: location});
  };

  const handleError = error => {
    setGeoLocation({...geoLocation, error});
  };

  useEffect(() => [
    navigator.geolocation.getCurrentPosition(handleChange, handleError),
    navigator.geolocation.watchPosition(handleChange, handleError),
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Geolocation:{' '}
        {geoLocation.coords
          ? `${geoLocation.coords.latitude}, ${geoLocation.coords.longitude}`
          : geoLocation.error}
      </Text>
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: blue,
  },
});
