/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  Alert,
  Image,
  TouchableHighlight,
} from 'react-native';

import {
  createTextMessage,
  createImageMessage,
  createLocationMessage,
} from './src/utils/MessageUtils';
import MessagingContainer, {
  INPUT_METHOD,
} from './src/components/MessagingContainer';
import ImageGrid from './src/components/ImageGrid';
import Status from './src/components/Status';
import MessageList from './src/components/MessageList';
import Toolbar from './src/components/Toolbar';
import MeasureLayout from './src/components/MeasureLayout';
import KeyboardState from './src/components/KeyboardState';

const fake_message = [
  createImageMessage('https://unsplash.it/300/300'),
  createTextMessage('World'),
  createTextMessage('Hello'),
  createLocationMessage({
    latitude: 37.78825,
    longitude: -122.4324,
  }),
];

const App = () => {
  const [appState, setAppState] = useState({
    message: [...fake_message],
    fullscreenImageId: null,
    isInputFocused: false,
    inputMethod: INPUT_METHOD.NONE,
  });

  const dismissFullscreenImage = () => {
    setAppState({...appState, fullscreenImageId: null});
  };

  const handlePressToolbarCamera = () => {
    setAppState({
      ...appState,
      inputMethod: INPUT_METHOD.CUSTOM,
      isInputFocused: false,
    });
  };

  const handlePressToolbarLocation = () => {
    setAppState({
      ...appState,
      inputMethod: INPUT_METHOD.NONE,
      isInputFocused: false,
    });
  };

  const handlePressImage = uri => {
    const newMessage = [createImageMessage(uri), ...appState.message];
    setAppState({...appState, message: newMessage});
  };

  const handleSubmit = text => {
    const newMessage = [createTextMessage(text), ...appState.message];
    setAppState({...appState, message: newMessage});
  };

  const handlePressMessage = ({id, type}) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                setAppState({
                  ...appState,
                  message: appState.message.filter(mess => mess?.id !== id),
                });
              },
            },
          ],
        );
        break;
      case 'image':
        setAppState({
          ...appState,
          fullscreenImageId: id,
          isInputFocused: false,
        });
      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }
  };

  const handleChangeFocus = isFocused => {
    setAppState({...appState, isInputFocused: isFocused});
  };

  const handleChangeInputMethod = inputMethod => {
    setAppState({...appState, inputMethod});
  };

  const renderMessageList = () => {
    return (
      <View style={styles.content}>
        <MessageList
          messages={appState.message}
          onPressMessage={handlePressMessage}
        />
      </View>
    );
  };

  const renderFullscreenImage = () => {
    const {fullscreenImageId} = appState;
    if (!fullscreenImageId) {
      return null;
    }

    const findImage = appState.message.find(
      image => image.id === fullscreenImageId,
    );

    if (!findImage) {
      return null;
    }

    const {uri} = findImage;

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={dismissFullscreenImage}>
        <Image source={{uri}} style={styles.fullscreenImage} />
      </TouchableHighlight>
    );
  };

  const renderToolBar = () => {
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={appState.isInputFocused}
          onSubmit={handleSubmit}
          onChangeFocus={handleChangeFocus}
          onPressCamera={handlePressToolbarCamera}
          onPressLocation={handlePressToolbarLocation}
        />
      </View>
    );
  };

  const renderInputMethodEditor = () => {
    <View style={styles.inputMethodEditor}>
      <ImageGrid onPressImage={handlePressImage} />
    </View>;
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (appState.fullscreenImageId) {
          dismissFullscreenImage();
          return true;
        }
        return false;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Status />
      <MeasureLayout>
        {layout => (
          <KeyboardState layout={layout}>
            {keyboardInfo => (
              <MessagingContainer
                {...keyboardInfo}
                inputMethod={appState.inputMethod}
                onChangeInputMethod={handleChangeInputMethod}
                renderInputMethodEditor={renderInputMethodEditor}>
                {renderMessageList()}
                {renderToolBar()}
              </MessagingContainer>
            )}
          </KeyboardState>
        )}
      </MeasureLayout>
      {renderInputMethodEditor()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default App;
