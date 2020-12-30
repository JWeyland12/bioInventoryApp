import React, {useState} from 'react';
import {View, ScrollView, Modal, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-elements';

const SciNamesModal = (props) => {
  const RenderList = () => {
    return (
      <View style={{marginBottom: 15}}>
        {props.items.map(i => {
          return (
            <TouchableOpacity style={{marginVertical: 10, alignItems: 'center'}}  key={props.items.indexOf(i).toString()}>
              <Text style={{fontSize: 20}} onPress={() => props.modalHandler(i)}>{i}</Text>
              {/* <Divider style={{height: 1}} /> */}
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <View style={styles.centeredView}>
      <Modal visible={props.isModalOpen} transparent={true}>
        <View style={styles.centeredView}>
          <ScrollView style={styles.modalView} contentContainerStyle={{alignItems: 'center'}}>
            <RenderList/>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    minWidth: 375,
    minHeight: 100,
    maxHeight: 300,
    // overflowY: 'scroll',
    backgroundColor: "#FFF",
    borderRadius: 5,
    // flexDirection: 'row',
    padding: 10,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
})

export default SciNamesModal;