import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import FormInput from './formInputComponent';
import {Icon} from 'react-native-elements';
import RoundButton from './roundedButtonComponent';


const TripMembers = (props) => {
  const [editMembers, setEditMembers] = useState(false);
  const [member, setMember] = useState('')

  const renderMembers = ({item}) => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Text selectable style={{fontSize: 20, marginRight: 10}}>{item.member}</Text>
        {!editMembers ? null : 
        (<View style={{marginLeft: 'auto'}}>
          <Icon 
            name='minus-circle' 
            type='font-awesome' 
            color='firebrick'
            onPress={() => deleteInfoHandler(item)}
          />
        </View>)}
      </View>
    )
  }

  const deleteInfoHandler = item => {
    props.deleteInfo(0, 0, item)
  }

  const addMember = () => {
    props.addMemberHandler(member)
    setMember('')
  }

  return (
    <View>
      <View style={{alignItems: 'center'}}>
        <Text 
          onPress={() => setEditMembers(!editMembers)} 
          style={{fontSize: 13, color: '#008b8b', marginBottom: 10}}>
          {!editMembers ? 'Edit' : 'Cancel'}
        </Text>
        <View style={{width: '100%', alignItems: 'center'}}>
          {props.members.length !== 0 ? 
          (<FlatList 
            data={props.members} 
            renderItem={renderMembers} 
            keyExtractor={item => item._id.toString()} />
            ) : <Text>No Members</Text>}
        </View>
      </View>
        <View style={{justifyContent: 'center', marginHorizontal: 50, paddingVertical: 10, flexDirection: 'row'}}>
          <FormInput 
            iconName='user'
            onChangeText={input => setMember(input)}
            value={member}
            placeholder='Member Name'
          />
          <View style={{marginLeft: 10, alignSelf: 'center'}}>
            <Icon 
              name='plus'
              type='font-awesome'
              color='green'
              size={30}
              style={{marginVertical: 'auto'}}
              onPress={() => addMember()}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            {/* <RoundButton 
              title='Add' 
              style={{paddingHorizontal: 20}} 
              textStyle={{fontSize: 15}} 
              onPress={() => addMember()} 
            /> */}
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({

})

export default TripMembers;