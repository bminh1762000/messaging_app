/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, StatusBar, Platform, View, Text} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const Status = () => {
  const [connectionType, setConnectionType] = useState({
    type: null,
    isConnected: null,
  });

  const handleChangeConnect = ({type, isConnected}) => {
    setConnectionType({
      type,
      isConnected,
    });
  };

  const backgroundColor = connectionType.isConnected ? 'white' : 'red';

  const barStyle = connectionType.isConnected
    ? 'dark-content'
    : 'light-content';

  const statusBar = (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={barStyle}
      animated={false}
    />
  );

  const messageContainer = (
    <View style={styles.messageContainer} pointerEvents="none">
      {statusBar}
      {!connectionType.isConnected && (
        <View style={styles.bubble}>
          <Text styles={styles.text}>No network connection</Text>
        </View>
      )}
    </View>
  );

  useEffect(async () => {
    const subscription = NetInfo.addEventListener(handleChangeConnect);
    NetInfo.fetch().then(state =>
      setConnectionType({type: state.type, isConnected: state.isConnected}),
    );
    return () => {
      subscription();
    };
  }, []);

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.status, {backgroundColor}]}>{messageContainer}</View>
    );
  }

  return messageContainer;
};

const statusHeight = Platform.OS === 'ios' ? StatusBar.currentHeight : 0;

export default Status;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
  },
});
