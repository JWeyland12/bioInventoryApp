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

export const postSpeciesFromMaster = (sciName, comName) => dispatch => {
  fetch(baseUrl + 'species', {
    method: 'POST',
    body: JSON.stringify({sciName, comName}),
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
  .then(response => dispatch(addSpecimen(response)))
  .catch(error => {
    console.log('post specimen', error.message)
    alert(`The ${sciName} could not be created or already exists!`)
  })
}

export const addSpecimen = specimen => ({
  type: actionType.POST_SPECIMEN_FROM_MASTER,
  payload: specimen
})