import React, {useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TextInput} from 'react-native';
import {Button} from 'react-native-elements';

const Notes = (props) => {
  const [input, setInput] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#f8f8ff');
  const [borderColor, setBorderColor] = useState('gray');
  const [borderWidth, setBorderWidth] = useState(1)

  const onFocusHandler = () => {
    setBackgroundColor('#fff')
    setBorderColor('#008b8b')
    setBorderWidth(2)
  }

  const onBlurHandler = () => {
    setBackgroundColor('#f8f8ff')
    setBorderColor('gray')
    setBorderWidth(1)
  }

  return (
    <View>
      <TextInput
        style={{
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: borderWidth,
          width: 400,
          fontSize: 20,
          alignItems: 'flex-start',
          paddingHorizontal: 10,
          borderRadius: 10
          }}
        multiline={true}
        numberOfLines={4}
        placeholder={'Make a note...'}
        onFocus={() => onFocusHandler()}
        onBlur={() => onBlurHandler()}
        textAlignVertical='top'
        onChangeText={text => props.onNoteTaken(text)}
        value={props.value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  
})

export default Notes;