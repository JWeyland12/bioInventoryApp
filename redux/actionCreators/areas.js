import * as actionType from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';
import * as FileSystem from 'expo-file-system';


export const fetchAreas = (token) => dispatch => {
  fetch(baseUrl + 'areas', {
    headers: {'x-auth-token': token}
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
    const errMess = new Error(error.message);
    throw errMess
  }
  )
  .then(response => response.json())
  .then(areas => dispatch(addAreas(areas)))
}

export const addAreas = areas => ({
  type: actionType.ADD_AREAS,
  payload: areas
})

export const postArea = (projectId, area, geoRef, altitude, accuracy, karst, img, token) => async dispatch => {
  const fileName = img.split('/').pop();
  const newPath = FileSystem.documentDirectory + fileName;
  try {
    await FileSystem.moveAsync({
      from: img,
      to: newPath
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
  fetch(baseUrl + 'areas', {
    method: 'POST',
    body: JSON.stringify({projectId, area, geoRef, altitude, accuracy, karst, img: newPath}),
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
  .then(area => dispatch(addArea(area)))
  .then(area => console.log(`response: ${area}`))
  .catch(error => {
    console.log('post area', error.message)
    alert(`the ${area} area could not be created!`)
  })
}

export const addArea = area => ({
  type: actionType.POST_AREA,
  payload: area
})

export const updateArea = (areaId, area, geoRef, altitude, accuracy, karst, img, token) => async dispatch => {
  const fileName = img.split('/').pop();
  const newPath = FileSystem.documentDirectory + fileName;
  try {
    await FileSystem.moveAsync({
      from: img,
      to: newPath
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
  await fetch(baseUrl + 'areas', {
    method: 'PUT',
    body: JSON.stringify({_id: areaId, area, geoRef, altitude, accuracy, karst, img: newPath }),
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
    console.log('Update area', error.message)
    alert(`Area ${area} could not be updated`)
  })
  dispatch(fetchAreas(token))
}

export const addImageToArea = (areaId, uri, token) => async dispatch => {
  const fileName = uri.split('/').pop();
  const newPath = FileSystem.documentDirectory + fileName;
  try {
    await FileSystem.moveAsync({
      from: uri,
      to: newPath
    });
    const response = await fetch(baseUrl + 'areas', {
      method: 'PUT',
      body: JSON.stringify({_id: areaId, uri: newPath}),
      headers: {'content-type': 'application/json'}
    })
    if (!response.ok) {
      const err = new Error(`${response.msg}`)
      throw err
    }
    response.json()
    dispatch(fetchAreas(token))
  } catch(err) {
    alert('Request could not be completed')
    throw err
  }
}

export const addNoteToArea = (areaId, note, token) => async dispatch => {
  try {
    const date = new Date().toDateString()
    const response = await fetch(baseUrl + 'areas', {
      method: 'PUT',
      body: JSON.stringify({_id: areaId, note, date}),
      headers: {'content-type': 'application/json'}
    })
    if (!response.ok) {
      const err = response.msg
      alert(err)
    }
    response.json()
    dispatch(fetchAreas(token))
  } catch(err) {
    alert('Request could not be completed')
    throw err
  }
}

export const updateAreaNote = (areaId, noteId, note, token) => async dispatch => {
  try {
    const response = await fetch(baseUrl + 'areas', {
      method: 'PUT',
      body: JSON.stringify({_id: areaId, noteId, note}),
      headers: {'content-type': 'application/json'}
    })
    if (!response.ok) {
      const err = response.msg
      alert(err)
    }
    response.json()
    dispatch(fetchAreas(token))
  } catch(err) {
    alert('Request could not be completed')
    throw err
  }
}

export const deleteArea = (_id, token) => async dispatch => {
  await fetch(baseUrl + 'areas', {
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
    console.log('Delete area', error.message)
    alert(`Area could not be deleted`)
  })
  dispatch(fetchAreas(token))
}

export const deleteAreaInfoImage = (_id, imgObj) => async dispatch => {
  try {
    const response = await fetch(baseUrl + 'areas', {
      method: 'DELETE',
      body: JSON.stringify({_id: _id, imgObj: imgObj}),
      headers: {'content-type': 'application/json'}
    })
    if (!response.ok) {
      const err = response.msg
      throw err
    }

    const area = await response.json()
    dispatch(deleteAreaInfo(area))
  } catch(err) {
    alert('Request could not be completed')
    console.log('err', err)
  }
}

export const deleteAreaInfo = area => ({
  type: actionType.DELETE_AREA_INFO,
  payload: area
})

export const deleteAreaInfoNote = (_id, notesObj) => async dispatch => {
  try {
    const response = await fetch(baseUrl + 'areas', {
      method: 'DELETE',
      body: JSON.stringify({_id: _id, notesObj: notesObj}),
      headers: {'content-type': 'application/json'}
    })
    if (!response.ok) {
      const err = response.msg
      throw err
    }

    const area = await response.json()
    dispatch(deleteAreaInfo(area))
  } catch(err) {
    alert('Request could not be completed')
    console.log('err', err)
  }
}
