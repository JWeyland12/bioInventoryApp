import React from 'react';
import {FlatList} from 'react-native';
import {ListItem} from 'react-native-elements';

const Projects = (props) => {

  const renderProject = ({item}) => {
    return (
      <ListItem
        title={item.name}
        subtitle={item.county - item.state}
        leftAvatar={{ source: require('./images/stephensGap.jpg')}}
        />
    )
  }
  return (
    <FlatList
      data={props.projects}
      renderItem={renderProject}
      keyExtractor={item => item.id.toString()}
      />
  );
};

export default Projects;