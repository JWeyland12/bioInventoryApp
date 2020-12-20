import React from 'react';
import { Text, TouchableOpacity, StyleSheet} from 'react-native';

const RoundButton = (props) => {

  return (
    <TouchableOpacity
      style={{...styles.roundedButton, ...props.style}}
      onPress={props.onPress}
    >
      <Text style={{...styles.textStyle, ...props.textStyle}}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roundedButton: {
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#1b9cfc',
    borderRadius: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5
  },
  textStyle: {
    fontSize: 17,
    color: 'white'
  }
})

export default RoundButton;