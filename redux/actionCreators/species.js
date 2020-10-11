import * as actionType from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';

export const fetchSpecies = () => dispatch => {
  fetch(baseUrl + 'species')
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
    const errMess = new Error(error.message)
    throw errMess
  }
  )
  .then(response => response.json())
  .then(species => dispatch(addSpecies(species)))
}

const addSpecies = species => ({
  type: actionType.ADD_SPECIES,
  payload: species
})