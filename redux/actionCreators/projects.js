import * as actionType from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';

export const fetchProjects = () => dispatch => {
  fetch(baseUrl + 'projects')
  // console.log(`fetch made to ${baseUrl}projects`)
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