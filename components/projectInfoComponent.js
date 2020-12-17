import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet, Modal} from 'react-native';
import {Image} from 'react-native-elements';
import {connect} from 'react-redux';
import Notes from './noteComponent';

const mapDispatchToProps = {

}

const mapStateToProps = state => {
  return {
    projects: state.projects
  }
}

const ProjectInfo = (props) => {
  const projectId = props.navigation.getParam('projectId');
  const [project, setProject] = useState();

  console.log('project', project)

  useEffect(() => {
    if (projectId) {
      setProject(props.projects.projects.filter(item => item._id.toString() === projectId.toString()))
    }
  }, [projectId])


  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center'}}>
      
    </ScrollView>
  );
};

ProjectInfo.navigationOptions = {
  title: 'Property Info'
};

const styles = StyleSheet.create({

})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectInfo);