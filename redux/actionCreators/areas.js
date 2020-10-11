import * as actionType from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';

export const fetchAreas = () => dispatch => {
  fetch(baseUrl + 'areas')
  .then(response => {
    if (response.ok) {
      return response;
    } else {
      const err = new Error(`Error ${response.status}: ${response.statusText}`)
      err.response = response;
      throw err
    }
  },
  error => {
    const errMess = new Error(error.message);
    throw errMess
  }
  )
  .then(response => response.json())
  .then(areas => dispatch(addAreas(areas)))
}

const addAreas = areas => ({
  type: actionType.ADD_AREAS,
  payload: areas
})