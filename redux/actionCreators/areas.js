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

export const addAreas = areas => ({
  type: actionType.ADD_AREAS,
  payload: areas
})

export const postArea = (projectId, area, geoRef) => dispatch => {
  fetch(baseUrl + 'areas', {
    method: 'POST',
    body: JSON.stringify({projectId, area, geoRef}),
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

