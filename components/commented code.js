function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}

{/* <Input 
          leftIcon={<Icon name="angle-right" type="font-awesome" />} 
          leftIconContainerStyle={{ paddingRight: 10 }} 
          onChangeText={text => setSciName(text)}
          value={sciName}
          placeholder={'Scientific Name'}
        />
        <Input 
          leftIcon={<Icon name="angle-right" type="font-awesome" />} 
          leftIconContainerStyle={{ paddingRight: 10 }} 
          onChangeText={text => setComName(text)}
          value={comName}
          placeholder={'Common Name'}
        /> */}

//         import React, {useState} from 'react';
// import {View, Text, StyleSheet, Alert, TouchableOpacity, FlatList} from 'react-native';
// import {connect} from 'react-redux';
// import {Input, Icon, SearchBar, Button, ListItem} from 'react-native-elements';
// import ImgPicker from './imagePickerComponent';
// // import Search from './searchComponent';

// const mapStateToProps = state => {
//   return {species: state.species}
// }


// const CreateTripSpecies = (props) => {
//   const [masterList, setMasterList] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [filteredList, setFilteredList] = useState([]);
//   const {navigate} = props.navigation;
//   console.log('props', props.navigation);

//   (async function setState () {
//     if(!searchText && props.species.species) {
//       const importList = await props.species.species
//       setMasterList(importList)
//       setFilteredList(importList)
//     }
//   })()

//   const searchFilteredFunction = (text) => {
//     setSearchText(text)
//     if (text) {
//       const newData = masterList.filter(item => {
//         const itemData = (item.sciName) ? item.sciName.toUpperCase() : ''.toUpperCase()
//         const textData = text.toUpperCase();
//         return itemData.indexOf(textData) > -1;
//       })
//       setFilteredList(newData)
//     }
//   }

//   const renderList = ({item}) => {
//     return (
//       <ListItem 
//       title={item.sciName}
//       subtitle={item.comName}
//       onPress={() => {}}
//       leftAvatar={{ source: {uri: item.img}}}
//       topDivider
//       bottomDivider
//       rightIcon={<Icon name='angle-right' type='font-awesome'/>}
//     />
//     )
//   }


//   return (
//     <View style={{flex: 1}}>
//       <View style={styles.inputView}>
//         <Text style={{fontSize: 20}}>- OR -</Text>
//       </View>
//       <View style={{marginHorizontal: 50}}>
//         <Button title={'Enter New Species'} onPress={() => {}} />
//       </View>
//       <TouchableOpacity style={styles.TouchableOpacityStyle}>
//         <View>
//           <SearchBar 
//             onChangeText={(text) => searchFilteredFunction(text)}
//             value={searchText}
//             placeholder={`Search Species`}
//             lightTheme
//             cancelIcon
//             platform={'android'}
//           />
//           {!searchText ? null :
//           (<View>
//             <FlatList 
//               data={filteredList} 
//               renderItem={renderList} 
//               keyExtractor={(item) => item._id.toString()}
//             />
//           </View>)}
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };

// CreateTripSpecies.navigationOptions = {
//   title: 'New Species Observation'
// }

// export default connect(mapStateToProps)(CreateTripSpecies);

// const styles = StyleSheet.create({
//   listView: {
//     width: '75%',
//   },
//   containerStyle: {
//     backgroundColor: 'white',
//   },
//   TouchableOpacityStyle: {
//     position: "absolute",
//     width: '100%',
//     maxHeight: '100%',
//   },
//   inputView: {
//     marginTop: 75,
//     margin: 10,
//     justifyContent: 'center',
//     flexDirection: 'row'
//   }
// })

{/* <Input 
          leftIcon={<Icon name="angle-right" type="font-awesome" />} 
          leftIconContainerStyle={{ paddingRight: 10 }} 
          onChangeText={text => setSciName(text)}
          value={sciName}
          placeholder={'Scientific Name'}
        />
        <Input 
          leftIcon={<Icon name="angle-right" type="font-awesome" />} 
          leftIconContainerStyle={{ paddingRight: 10 }} 
          onChangeText={text => setComName(text)}
          value={comName}
          placeholder={'Common Name'}
        /> */}