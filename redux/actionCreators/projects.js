import * as actionType from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';
import * as FileSystem from 'expo-file-system';

export const fetchProjects = (token) => dispatch => {
  fetch(baseUrl + 'projects', {
    headers: {'x-auth-token': token}
  })
  .then(
    response => {
      if (response.ok) {
        return response
      } else {
        const err = new Error(`Error ${response.status}: ${response.statusText}`);
        err.response = response;
        throw err
      }
    },
    error => {
      const errMess = new Error(error.message)
      throw errMess
    }
  )
  .then(response => response.json())
  .then(projects => dispatch (addProjects(projects)))
};

export const addProjects = projects => ({
  type: actionType.ADD_PROJECTS,
  payload: projects
});

export const postProject = (projectName, projectState, projectCounty, img, token) => async dispatch => {
  const fileName = img.split('/').pop();
  const newPath = FileSystem.documentDirectory + fileName;
  console.log('newPath', newPath)
  try {
    await FileSystem.moveAsync({
      from: img,
      to: newPath
    });
  } catch (err) {
    console.log(err);
    throw err;
  }

  fetch(baseUrl + 'projects', {
    method: 'POST',
    body: JSON.stringify({name: projectName, state: projectState, county: projectCounty, img: newPath.toString()}),
    headers: {'content-type': 'application/json', 'x-auth-token': token}
  })
  .then(response => {
    if (response.ok) {
      return response
    } else {
      const err = new Error(`Error ${response.status}: ${response.statusText}`)
      err.response = response
      throw err
    }
  },
  err => {throw err}
  )
  .then(response => response.json())
  .then(response => dispatch(addProject(response)))
  .catch(error => {
    console.log('post project', error.message)
    alert(`The ${projectName} project already exists!`)
  })
}

export const addProject = project => ({
  type: actionType.POST_PROJECT,
  payload: project
});

export const updateProject = (projectId, name, state, county, img, token) => async dispatch => {
  const fileName = img.split('/').pop();
  const newPath = FileSystem.documentDirectory + fileName;
  console.log('newPath', newPath)
  try {
    await FileSystem.moveAsync({
      from: img,
      to: newPath
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
  await fetch(baseUrl + 'projects', {
    method: 'PUT',
    body: JSON.stringify({_id: projectId, name, state, county, img: newPath.toString()}),
    headers: {'content-type': 'application/json'}
  })
  .then(response => {
    if (response.ok) {
      return response
    } else {
      const err = new Error(`Error ${response.status}: ${response.statusText}`)
      err.response = response
      throw err
    }
  },
  err => {throw err}
  )
  .then(response => response.json())
  .catch(error => {
      console.log('Update project', error.message)
      alert(`Project ${name} could not be updated.`)
  })
  dispatch(fetchProjects(token))
}

export const addImageToProject = (projectId, uri, token) => async dispatch => {
  const fileName = uri.split('/').pop();
  const newPath = FileSystem.documentDirectory + fileName;
  console.log('newPath', newPath)
  try {
    await FileSystem.moveAsync({
      from: uri,
      to: newPath
    });
    const response = await fetch(baseUrl + 'projects', {
      method: 'PUT',
      body: JSON.stringify({_id: projectId, uri: newPath}),
      headers: {'content-type': 'application/json'}
    })
    if (!response.ok) {
      const err = new Error(`${response.msg}`)
      throw err
    }
    response.json()
    dispatch(fetchProjects(token))
  } catch(err) {
    alert('Request could not be completed')
    throw err
  }
}

export const deleteProject = (_id, token) => async dispatch => {
  await fetch(baseUrl + 'projects', {
    method: 'DELETE',
    body: JSON.stringify({_id}),
    headers: {'content-type': 'application/json'},
  })
  .then(response => {
    if (response.ok){
      return response
    } else {
      const err = new Error(`Error ${response.status}: ${response.statusText}`)
      err.response = response
      throw err
    }
  },
  err => {throw err}
  )
  .then(response => response.json())
  .catch(error => {
    console.log('Delete project', error.message)
    alert(`Project could not be deleted`)
  })
  dispatch(fetchProjects(token))
}