import * as actionType from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';

export const fetchProjects = () => dispatch => {
  fetch(baseUrl + 'projects')
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

export const postProject = (projectName, projectState, projectCounty, img) => dispatch => {
  console.log('projectName:', img)
  fetch(baseUrl + 'projects', {
    method: 'POST',
    body: JSON.stringify({name: projectName, state: projectState, county: projectCounty, img}),
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

export const updateProject = (projectId, name, state, county) => async dispatch => {
  await fetch(baseUrl + 'projects', {
    method: 'PUT',
    body: JSON.stringify({_id: projectId, name, state, county}),
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
  dispatch(fetchProjects())
}

export const deleteProject = (_id) => async dispatch => {
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
  dispatch(fetchProjects())
}