import React, {useState} from 'react';
import {SearchBar, ListItem, Icon} from 'react-native-elements';
import {View, FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';

const Search = (props) => {
  const [masterList, setMasterList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [listType, setListType] = useState('');
  const idObject = props.idObject
  const navigate = props.navigate;

  (async function setState () {
    if(!searchText && props.masterList && props.listType) {
      const importList = await props.masterList
      const importListType = await props.listType
      setMasterList(importList)
      setFilteredList(importList)
      setListType(importListType)
    }
  })()

  const searchFilteredFunction = (text) => {
    setSearchText(text)
    if (text) {
      const newData = masterList.filter(item => {
        const itemData = (item.sciName) ? item.sciName.toUpperCase() : ''.toUpperCase()
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
      setFilteredList(newData)
    }
  }

  const renderList = ({item}) => {
    return (
      <ListItem 
      title={item.sciName}
      subtitle={item.comName}
      onPress={() => navigate('CreateSpecies', {specimen: item, idObject: idObject})}
      leftAvatar={{ source: {uri: item.img}}}
      topDivider
      bottomDivider
      rightIcon={<Icon name='angle-right' type='font-awesome'/>}
    />
    )
  }

  return (
    <View>
      <SearchBar 
        onChangeText={(text) => searchFilteredFunction(text)}
        value={searchText}
        placeholder={`Search ${listType}`}
        lightTheme
        cancelIcon
        platform={'android'}
      />
      {!searchText ? null :
      (<View>
        <FlatList 
          data={filteredList} 
          renderItem={renderList} 
          keyExtractor={(item) => item._id.toString()}
        />
      </View>)}
    </View>
  );
};

export default Search;


 // const filterData = (text) => {
  //   if(text) {
  //     setSearchText(text)
  //     const filter = [masterList.filter(name => {
  //       function anon() {
  //         for (const value of name) {
  //           if(name[value].toUpperCase() === text.toUpperCase()) {
  //             const x = name[value]
  //             return x.toUpperCase()
  //           }
  //         }
  //       }
  //       return anon() === text.toUpperCase()
  //     })]
  //     console.log('filter', filter)
  //     return filter
  //   }
  // }