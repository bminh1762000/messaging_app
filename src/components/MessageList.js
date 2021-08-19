import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const keyExtractor = item => item.id.toString();

const MessageList = ({messages, onPressMessage}) => {
  const renderMessageBody = ({type, text, uri, coordinate}) => {
    switch (type) {
      case 'text':
        return (
          <View style={styles.messageBubble}>
            <Text style={styles.text}>{text}</Text>
          </View>
        );
      case 'image':
        return <Image source={{uri}} style={styles.image} resizeMode="cover" />;
      case 'location':
        return (
          <MapView
            initialRegion={{
              ...coordinate,
              latitudeDelta: 0.08,
              longitudeDelta: 0.04,
            }}
            style={styles.map}>
            <Marker coordinate={coordinate} />
          </MapView>
        );
      default:
        return null;
    }
  };

  const renderItem = ({item}) => {
    return (
      <View key={item.id} style={styles.messageRow}>
        <TouchableOpacity onPress={() => onPressMessage(item)}>
          {renderMessageBody(item)}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      inverted
      keyboardShouldPersistTaps="handled"
    />
  );
};

export default MessageList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
    marginRight: 10,
    marginLeft: 60,
  },
  messageBubble: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgb(16,135,255)',
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  map: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
});
