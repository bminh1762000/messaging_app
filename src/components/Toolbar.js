import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

const ToolbarButton = ({title, onPress}) => {
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{title}</Text>
  </TouchableOpacity>;
};

const Toolbar = ({
  isFocused,
  onChangeFocus,
  onSubmit,
  onPressCamera,
  onPressLocation,
}) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);

  const handleChangeText = text => {
    setInputText(text);
  };

  const handleBlur = () => {
    onChangeFocus(false);
  };

  const handleFocus = () => {
    onChangeFocus(true);
  };

  const handleSubmitEditing = () => {
    if (!inputText) {
      return;
    }
    onSubmit(inputText);
    setInputText('');
  };

  useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [isFocused]);

  return (
    <View style={styles.toolbar}>
      <ToolbarButton title={'📷'} onPress={onPressLocation} />
      <ToolbarButton title={'📍'} onPress={onPressCamera} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Type something"
          blurOnSubmit={false}
          value={inputText}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          ref={inputRef}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      </View>
    </View>
  );
};

export default Toolbar;

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingLeft: 16,
    backgroundColor: 'white',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  button: {
    top: -2,
    marginRight: 12,
    fontSize: 20,
    color: 'grey',
  },
});
