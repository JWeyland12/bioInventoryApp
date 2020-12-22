import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Modal, FlatList, ToastAndroid} from 'react-native';
import {Button, ListItem, Overlay, Icon} from 'react-native-elements';
import RoundButton from './customStyledComponents/roundedButtonComponent';

const Notes = (props) => {
  const [backgroundColor, setBackgroundColor] = useState('#f8f8ff');
  const [borderColor, setBorderColor] = useState('gray');
  const [borderWidth, setBorderWidth] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [note, setNote] = useState('')
  //modalNote is for displaying note in modal without affecting textInput
  const [modalNote, setModalNote] = useState('');
  const [noteId, setNoteId] = useState('');
  //persistNote is for resetting note text if note edit is canceled
  const [persistNote, setPersistNote] = useState('');
  //visible is for note overlay 'delete'. visibleImg is for image overlay 'delete'
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [noteIndex, setNotedIndex] = useState('');

  //textInput style onFocus
  const onFocusHandler = () => {
    setBackgroundColor('#fff')
    setBorderColor('#008b8b')
    setBorderWidth(2)
  }

  //textInput style onBlur
  const onBlurHandler = () => {
    setBackgroundColor('#f8f8ff')
    setBorderColor('gray')
    setBorderWidth(1)
  }

  //toast to show success, closes editor, and sends new modal note to submission
  const saveNote = () => {
    ToastAndroid.show('Note saved', ToastAndroid.SHORT, ToastAndroid.TOP, ToastAndroid.CENTER)
    setIsEditing(!isEditing)
    handleSubmit(modalNote)
  }

  //modalNote changed back to saved persisted note.
  const cancelNoteUpdate = () => {
    setIsEditing(!isEditing)
    setModalNote(persistNote)
  }

  //modalNote makes a copy of note as to not display in textInput.
  //NoteId is for submission and updating note in database
  //persist note is a copy of note in case update is canceled
  const showModal = (item) => {
    setModalNote(item.note)
    setIsModalOpen(!isModalOpen)
    setNoteId(item._id)
    setPersistNote(item.note)
  }

  //close modal and clears modalNote for next opening
  const hideModal = () => {
    setIsModalOpen(!isModalOpen)
    setModalNote('')
  }

  //handles submission of note and updated note
  const handleSubmit = (modalNote) => {
    if (!note) {
      props.submitNoteHandler(null, modalNote, noteId)
    }
    if (!modalNote) {
      props.submitNoteHandler(note, null)
      setNote('')
    }
  }

  const overlayHandler = (id) => {
    setIsOverlayVisible(!isOverlayVisible)
    {!id ? setNotedIndex(''): setNotedIndex(id)}
  }

  const renderNotes = ({item}) => {
    return (
      <View>
        {noteIndex.toString() === item._id.toString() ? 
        (<Overlay isVisible={isOverlayVisible} onBackdropPress={() => overlayHandler()} overlayStyle={styles.overlay}>
          <Text style={{fontSize: 20}} onPress={() => props.deleteInfo(null, item)}>Delete</Text>
        </Overlay>)
        : null}
        <View style={styles.listItemContainer}>
          <ListItem 
            title={`${item.note.slice(0, 30)}...`}
            subtitle={item.date}
            topDivider
            bottomDivider
            rightIcon={<Icon name='angle-right' type='font-awesome'/>}
            borderRadius={10}
            borderWidth={1}
            borderColor={'gray'}
            onPress={() => showModal(item)}
            onLongPress={() => overlayHandler(item._id)}
          />
        </View>
      </View>
    )
  }

  return (
    <View>
      <View style={{width: '100%', marginBottom: 10}}>
        {!props.notes ? null : (<FlatList data={props.notes} renderItem={renderNotes} keyExtractor={item => item._id.toString()}/>)}
      </View>
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
        onChangeText={text => setNote(text)}
        value={note}
      />
      <View style={styles.noteButton}>
        <RoundButton 
          title='Create Note'
          onPress={() => handleSubmit()}
          textStyle={{fontSize: 15}}
          style={{paddingHorizontal: 20}}
        />
      </View>
      <Modal
        animated='fade'
        transparent={true}
        visible={isModalOpen}
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
                  fontSize: 20,
                  alignItems: 'flex-start',
                }}
                multiline={true}
                value={modalNote}
                textAlignVertical='top'
                onChangeText={(input) => setModalNote(input)}
              />
            </View>)
            :
            (<View style={{display: 'flex'}}>
              <View style={styles.icons}>
                <Icon name='pencil' type='font-awesome' onPress={() => setIsEditing(!isEditing)}/>
                <Text>{'  '}</Text>
                <Icon name='times' type='font-awesome' onPress={() => hideModal()} />
              </View>
              <Text selectable style={{fontSize: 20}}>{modalNote}</Text>
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
  },
  overlay: {
    height: 50,
    width: 'auto'
  },
  listItemContainer: {
    marginHorizontal: 30,
  },
  noteButton: {
    alignItems: 'center',
    marginTop: 20
  },
})

export default Notes;