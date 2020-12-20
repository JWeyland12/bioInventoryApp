import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements'

const FormInput = (props) => {
  return (
    <View style={{...styles.inputView, ...props.style}}>
      <Icon 
        color={props.iconColor}
        name={props.iconName}
        type='font-awesome'
      />
      <TextInput 
        style={{...styles.margin, ...props.textStyle}}
        onChangeText={text => props.onChangeText(text)}
        placeholder={props.placeholder}
        value={props.value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    width: '100%',
    backgroundColor: '#f1f3f6',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingLeft: 15
  },
  margin: {
    marginVertical: 7,
    // marginHorizontal: 10,
    paddingHorizontal: 12,
    fontSize: 20,
    width: '100%'
  },
})

export default FormInput;