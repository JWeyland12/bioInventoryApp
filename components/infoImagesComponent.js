import React, {useState} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {Image, Button, Icon, Overlay} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import RoundButton from './customStyledComponents/roundedButtonComponent';
import {connect} from 'react-redux';


const InfoImages = (props) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  //modalVisible for image modal. modalImage is uri for modal image. modalIndex changes image
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalIndex, setModalIndex] = useState();
  const [imageIndex, setImageIndex] = useState('')

  //image upload from camera or gallery
  const verifyCameraPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA);
    if (result.status !== 'granted') {
      Alert.alert('Permissions not granted', [{text: 'Ok'}])
      return false
    }
    return true
  }

  const verifyGalleryPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (result.status !== 'granted') {
      Alert.alert('Permissions not granted', [{text: 'Ok'}])
      return false
    }
    return true
  }

  const pickImageHandler = async () => {
    const hasPermission = await verifyGalleryPermissions()
    if (!hasPermission) {
      return
    }
    const imageGal = await ImagePicker.launchImageLibraryAsync({
      aspect: [1,1],
      quality: 0.75,
      allowsMultipleSelection: true,

      // allowsEditing: true
    });
    props.newImageHandler(imageGal.uri)
  }

  const takeImageHandler = async () => {
    const hasPermission = await verifyCameraPermissions 
    if (!hasPermission) {
      return
    }
    const imageCam = await ImagePicker.launchCameraAsync({
      aspect: [1,1],
      quality: 0.75,
      // allowsEditing: true
    });
    props.newImageHandler(imageCam.uri)
  }

  const overlayHandler = (id) => {
    setIsOverlayOpen(!isOverlayOpen)
    {!id ? setImageIndex('') : setImageIndex(id)}
  }

  const deleteInfoHandler = image => {
    props.deleteInfo(image, null)
    setImageIndex('')
    setIsOverlayOpen(!isOverlayOpen)
  }

  const Images = () => {
    return props.images.map(image => {
      return (
        <View key={image._id}>
          {imageIndex.toString() === image._id.toString() ?
          (<Overlay isVisible={isOverlayOpen} onBackdropPress={() => overlayHandler()} overlayStyle={styles.overlay}>
            <Text style={{fontSize: 20}} onPress={() => deleteInfoHandler(image)}>Delete</Text>
          </Overlay>)
          : null}
          <TouchableOpacity onLongPress={() => overlayHandler(image._id)} onPress={() => imgModalHandler(image)} >
            <Image source={{uri: image.uri}} style={styles.images}/>
          </TouchableOpacity>
        </View>
      )
    })  
  }

  //handles modal when image clicked
  const imgModalHandler = (image) => {
    let index = props.images.findIndex(i => i.uri === image.uri)
    setModalIndex(index)
    setModalImage(props.images[index].uri)
    setIsModalOpen(!isModalOpen)
  }

  //handles modal next image
  const nextModalImage = () => {
    if (modalIndex + 1 <= props.images.length - 1) {
      setModalIndex(modalIndex + 1)
      setModalImage(props.images[modalIndex + 1].uri)
    } else {
      setModalIndex(0)
      setModalImage(props.images[0].uri)
    }
  }

  //handles modal previous image
  const previousModalImage = () => {
    if (modalIndex - 1 < 0) {
      setModalIndex(props.images.length - 1)
      setModalImage(props.images[props.images.length - 1].uri)
    } else {
      setModalIndex(modalIndex - 1)
      setModalImage(props.images[modalIndex - 1].uri)
    }
  }

  return (
    <View>
      {!props.images ? 
      (<Text style={{fontSize: 20}}>No images</Text>) :
      (<View style={styles.imagesContainer}>
        <Images />
      </View>)}
      <View style={{flexDirection: 'row', marginTop: 20, justifyContent: 'center'}}>
        <RoundButton 
          title='Take Picture' 
          onPress={takeImageHandler}
          textStyle={{fontSize: 15}}
          style={{paddingHorizontal: 20}}
        />
        <View style={{margin: 5}}></View>
        <RoundButton 
          title='Add Image'
          onPress={pickImageHandler}
          textStyle={{fontSize: 15}}
          style={{paddingHorizontal: 20}}
        />
      </View>
      <View style={styles.centeredView}>
        <Modal
          transparent={true}
          visible={isModalOpen}
          onRequestClose={() => setIsModalOpen(!isModalOpen)}
        >
          <View style={styles.centeredView}>
            <View>
              <Icon name='times' type='font-awesome' onPress={() => setIsModalOpen(!isModalOpen)}/>
            </View>
            <View style={styles.modalView}>
              <View style={styles.modalIcons}>
                <Icon name='angle-left' type='font-awesome' color='white' onPress={() => previousModalImage()}/>
              </View>
              <Image source={{uri: modalImage}} style={{width: 350, height: 350}} />
              <View style={styles.modalIcons}>
                <Icon name='angle-right' type='font-awesome' color='white' onPress={() => nextModalImage()}/>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  images: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'whitesmoke'
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    minWidth: 375,
    minHeight: 375,
    backgroundColor: "#000",
    borderRadius: 10,
    flexDirection: 'row',
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
  modalIcons: {
    margin: 3,
    alignSelf: 'center'
  },
  overlay: {
    height: 50,
    width: 'auto'
  },
})

export default InfoImages;