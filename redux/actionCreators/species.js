import * as actionType from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';
import * as FileSystem from 'expo-file-system';

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

export const postSpeciesFromMaster = (sciName, comName, img) => async dispatch => {
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
  fetch(baseUrl + 'species', {
    method: 'POST',
    body: JSON.stringify({sciName, comName, img: newPath}),
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

export const postSpeciesFromTrip = (sciName, comName, img, tripObj) => async dispatch => {
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
  fetch(baseUrl + 'species', {
    method: 'POST',
    body: JSON.stringify({sciName, comName, img: newPath, tripObj}),
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

export const updateSpecies = (_id, sciName, comName, img) => async dispatch => {
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
  await fetch(baseUrl + 'species', {
    method: 'PUT',
    body: JSON.stringify({_id, sciName, comName, img: newPath}),
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
    console.log('Update species', error.message)
    alert(`Species ${sciName} - ${comName} could not be updated`)
  })
  dispatch(fetchSpecies())
}

export const updateSpeciesObservation = (_id, tripObj) => async dispatch => {
  console.log('hit here')
  await fetch(baseUrl + 'species', {
    method: 'PUT',
    body: JSON.stringify({_id, tripObj}),
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
    console.log('Update species', error.message)
    alert(`Species ${sciName} - ${comName} could not be updated`)
  })
  dispatch(fetchSpecies())
}

export const deleteSpeciesFromMaster = (_id) => async dispatch => {
  await fetch(baseUrl + 'species', {
    method: 'DELETE',
    body: JSON.stringify({_id}),
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
    console.log('Delete Species', error.message)
    alert(`Species could not be deleted`)
  })
  dispatch(fetchSpecies())
}