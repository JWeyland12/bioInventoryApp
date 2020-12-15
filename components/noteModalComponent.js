import React, {useState} from 'react';
import {View, Text, Modal, StyleSheet, TextInput, ToastAndroid} from 'react-native';
import {Icon} from 'react-native-elements';

const NoteModal = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const saveNote = () => {
    ToastAndroid.show('Note saved', ToastAndroid.SHORT, ToastAndroid.TOP, ToastAndroid.CENTER)
    setIsEditing(!isEditing)
    props.submitNoteHandler()
  }

  const cancelNoteUpdate = () => {
    setIsEditing(!isEditing)
    props.editModalNoteHanlder(props.persistNote)
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animated='fade'
        transparent={true}
        visible={props.isModalOpen}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {isEditing ? 
            (<View>
              <View style={styles.icons}>
                <Icon name='floppy-o' type='font-awesome' onPress={() => saveNote()}/>
                <Text>{'  '}</Text>
                <Icon name='times-circle-o' type='font-awesome' onPress={() => cancelNoteUpdate()} />
              </View>
              <TextInput 
                style={{
                  backgroundColor: 'white',
                  // borderColor: '#008b8b',
                  // borderWidth: 2,
                  fontSize: 20,
                  alignItems: 'flex-start',
                  // borderRadius: 10,
                  // width: '100%'
                }}
                multiline={true}
                value={props.note}
                textAlignVertical='top'
                onChangeText={(input) => {props.editModalNoteHanlder(input)}}
              />
            </View>)
            :
            (<View style={{display: 'flex'}}>
              <View style={styles.icons}>
                <Icon name='pencil' type='font-awesome' onPress={() => setIsEditing(!isEditing)}/>
                <Text>{'  '}</Text>
                <Icon name='times' type='font-awesome' onPress={() => props.hideModal()} />
              </View>
              <Text selectable style={{fontSize: 20}}>{props.note}</Text>
            </View>)}
          </View>
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
    margin: 20,
    minWidth: 375,
    minHeight: 400,
    backgroundColor: "white",
    borderRadius: 10,
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
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
})

export default NoteModal;