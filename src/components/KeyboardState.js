/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {Keyboard, Platform} from 'react-native';

const INITIAL_ANIMATION_DURATION = 250;

const KeyboardState = ({children, layout}) => {
  const [stateKeyboard, setStateKeyboard] = useState({
    contentHeight: layout?.height,
    keyboardHeight: 0,
    keyboardVisible: false,
    keyboardWillShow: false,
    keyboardWillHide: false,
    keyboardAnimationDuration: INITIAL_ANIMATION_DURATION,
  });

  const measure = event => {
    const {
      endCoordinates: {height, screenY},
      duration = INITIAL_ANIMATION_DURATION,
    } = event;

    setStateKeyboard({
      ...stateKeyboard,
      contentHeight: screenY - layout?.y,
      keyboardHeight: height,
      keyboardAnimationDuration: duration,
    });
  };

  const onKeyboardWillShow = event => {
    setStateKeyboard({...stateKeyboard, keyboardWillShow: true});
    measure(event);
  };

  const onKeyboardDidShow = event => {
    setStateKeyboard({
      ...stateKeyboard,
      keyboardWillShow: false,
      keyboardVisible: true,
    });
    measure(event);
  };

  const onKeyboardWillHide = event => {
    setStateKeyboard({...stateKeyboard, keyboardWillHide: true});
    measure(event);
  };

  const onKeyboardDidHide = event => {
    setStateKeyboard({
      ...stateKeyboard,
      keyboardWillHide: false,
      keyboardVisible: false,
    });
    measure(event);
  };

  useEffect(() => {
    let subscriptions = [];
    if (Platform.OS === 'ios') {
      subscriptions = [
        Keyboard.addListener('keyboardWillShow', onKeyboardWillShow),
        Keyboard.addListener('keyboardWillHide', onKeyboardWillHide),
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow),
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide),
      ];
    } else {
      subscriptions = [
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow),
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide),
      ];
    }
    return () => {
      subscriptions.map(subscription => subscription.remove());
    };
  }, []);

  return children({
    containerHeight: layout?.height,
    contentHeight: stateKeyboard.contentHeight,
    keyboardHeight: stateKeyboard.keyboardHeight,
    keyboardVisible: stateKeyboard.keyboardVisible,
    keyboardWillShow: stateKeyboard.keyboardWillShow,
    keyboardWillHide: stateKeyboard.keyboardWillHide,
  });
};

export default KeyboardState;
