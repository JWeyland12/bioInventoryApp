import React, {useState} from 'react';
import {SearchBar, ListItem, Icon} from 'react-native-elements';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, Switch} from 'react-native';

const Search = (props) => {
  const [masterList, setMasterList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [listType, setListType] = useState('');
  const [switchView, setSwitchView] = useState(false)
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
        const itemData = !switchView ? (item.comName) ? item.comName.toUpperCase() : ''.toUpperCase() :
          (item.sciName) ? item.sciName.toUpperCase() : ''.toUpperCase()
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
      setFilteredList(newData)
    }
  }

  const renderList = ({item}) => {
    return (
      <View style={styles.listView}>
        <ListItem 
          title={!switchView ? item.comName : item.sciName}
          subtitle={!switchView ? item.sciName : item.comName}
          onPress={() => navigate('CreateSpecies', {specimen: item, idObject: idObject})}
          leftAvatar={{ source: {uri: item.img}}}
          topDivider
          bottomDivider
          rightIcon={<Icon name='angle-right' type='font-awesome'/>}
        />
      </View>
    )
  }

  return (
    <View>
      <View style={{flexDirection: 'row', marginLeft: 'auto', marginTop: 12, marginRight: 20}}>
        <Text style={{color: 'gray'}}>Search by Scientific Name</Text>
        <Switch value={switchView} onChange={() => setSwitchView(!switchView)} />
      </View>
      <View style={styles.searchBar}>
        <SearchBar 
          onChangeText={(text) => searchFilteredFunction(text)}
          value={searchText}
          placeholder={`Search ${listType}`}
          lightTheme
          cancelIcon
          platform={'android'}
        />
      </View>
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

const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 1000,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  listView: {
    // marginVertical: 2,
    marginHorizontal: 20,
    borderRadius: 1000,
    overflow: 'hidden'
  }
})

export default Search;