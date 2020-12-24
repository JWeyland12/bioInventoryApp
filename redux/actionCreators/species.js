import * as actionType from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';
import * as FileSystem from 'expo-file-system';

export const fetchSpecies = (user) => dispatch => {
  const route = !user.user.admin ? 'species' : 'species/admin'
  fetch(baseUrl + route, {
    headers: {'content-type': 'application/json', 'x-auth-token': user.token}
  })
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

export const postSpeciesFromMaster = (sciName, comName, rank, img, user) => async dispatch => {
  const route = !user.user.admin ? 'species' : 'species/admin'
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
  fetch(baseUrl + route, {
    method: 'POST',
    body: JSON.stringify({sciName, comName, rank, img: newPath}),
    headers: {'content-type': 'application/json', 'x-auth-token': user.token}
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

export const postSpeciesFromTrip = (sciName, comName, rank, img, tripObj, user) => async dispatch => {
  const route = !user.user.admin ? 'species' : 'species/admin'
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
  fetch(baseUrl + route, {
    method: 'POST',
    body: JSON.stringify({sciName, comName, rank, img: newPath, tripObj}),
    headers: {'content-type': 'application/json', 'x-auth-token': user.token}
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

export const updateSpecies = (_id, sciName, comName, rank, img, specimen) => async dispatch => {
  const route = !specimen.default ? 'species' : 'species/admin'
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
  await fetch(baseUrl + route, {
    method: 'PUT',
    body: JSON.stringify({_id, sciName, comName, rank, img: newPath}),
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
  .then(response => dispatch(updateSpecimen(response)))
  .catch(error => {
    console.log('Update species', error.message)
    alert(!specimen.default ? `Species ${sciName} - ${comName} could not be updated` : `The ${comName} specimen requires admin privileges to update!`)
  })
}

export const updateSpeciesObservation = (specimen, tripObj, img) => async dispatch => {
  if (img) {
    const fileName = img.split('/').pop();
    const newPath = FileSystem.documentDirectory + fileName;
    console.log('newPath', newPath)
    try {
      await FileSystem.moveAsync({
        from: img,
        to: newPath
      });
      const response = await fetch(baseUrl + 'species', {
        method: 'PUT',
        body: JSON.stringify({_id: specimen._id, tripObj: tripObj, uri: {uri: newPath}}),
        headers: {'content-type': 'application/json'}
      })

      if (!response.ok) {
        const err = new Error(`Error ${response.message}`)
        err.response = response
        throw err
      }

      const species = await response.json()
      dispatch(updateSpecimen(species))
    } catch (err) {
      console.log('Update Species', err);
      alert(`Species image could not be added`)
      throw err;
    }
  } else {
    await fetch(baseUrl + 'species', {
      method: 'PUT',
      body: JSON.stringify({_id: specimen._id, tripObj}),
      headers: {'content-type': 'application/json'}
    })
    .then(response => {
      if (response.ok) {
        console.log('ok response')
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
    .then(response => dispatch(updateSpecimen(response)))
    .catch(error => {
      console.log('Update species', error.message)
      alert(`Species ${specimen.sciName} - ${specimen.comName} could not be updated`)
    })
  }
}

const updateSpecimen = specimen => ({
  type: actionType.UPDATE_SPECIES,
  payload: specimen
})

export const createSpeciesNote = (specimen, tripObj, note) => async dispatch => {
  try {
    const date = await new Date().toDateString()
    const response = await fetch(baseUrl + 'species', {
      method: 'PUT',
      body: JSON.stringify({_id: specimen._id, tripObj, note: {note, date}}),
      headers: {'content-type': 'application/json'}
    });

    if(!response.ok) {
      const err = new Error(`${response.msg}`)
      throw err
    }

    const species = await response.json()
    dispatch(updateSpecimen(species))
  } catch(err) {
    console.log('Add species note', err);
    alert('Note could not be added')
  }
}

export const updateSpeciesNote = (noteId, specimen, tripObj, note) => async dispatch => {
  try {
    const response = await fetch(baseUrl + 'species', {
      method: 'PUT',
      body: JSON.stringify({noteId, _id: specimen._id, tripObj, note}),
      headers: {'content-type': 'application/json'}
    })
  
    if (!response.ok) {
      const err = new Error(`${response.status}: ${response.statusText}`)
      throw err
    }
    
    const species = await response.json()
    dispatch(updateSpecimen(species))
  } catch(err) {
    console.log('Update species note', err)
    alert('Note could not be updated')
  }
}

export const deleteSpeciesFromMaster = (specimen) => async dispatch => {
  const route = !specimen.default ? 'species' : 'species/admin'
  // if (route === 'species/admin') {
  //   if ()
  // }
  try {
    const response = await fetch(baseUrl + route, {
      method: 'DELETE',
      body: JSON.stringify({_id: specimen._id}),
      headers: {'content-type': 'application/json'}
    })

    if (!response.ok) {
      const err = new Error(`Error ${response.status}: ${response.statusText}`)
      err.response = response
      throw err
    }

    const species = await response.json()
    dispatch(deleteSpecimen(species))
  } catch(err) {
    console.log('Delete Species', err.message)
    alert(!specimen.default ? `The specimen ${specimen.comName} could not be deleted` : `The specimen ${specimen.comName} requires admin privileges to delete!` )
  }
}

const deleteSpecimen = specimen => ({
  type: actionType.DELETE_SPECIES,
  payload: specimen
})