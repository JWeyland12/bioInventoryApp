import * as actionType from "../actionTypes";
import { baseUrl } from "../../shared/baseUrl";

export const fetchTrips = (token) => (dispatch) => {
  fetch(baseUrl + "trips", {
    headers: {'x-auth-token': token}
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          const err = new Error(`Error ${response.status}: ${response.statusText}`);
          err.response = response;
          throw err;
        }
      },
      (error) => {
        const errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then((response) => response.json())
    .then((trips) => dispatch(addTrips(trips)));
};

export const addTrips = trips => ({
  type: actionType.ADD_TRIPS,
  payload: trips
})

export const postTrip = (areaId, token) => dispatch => {
  const date = new Date().toDateString()
  console.log('date', date)
  fetch(baseUrl + 'trips', {
    method: 'POST',
    body: JSON.stringify({areaId, date}),
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
  .then(response => dispatch(addTrip(response)))
  .catch(error => {
    console.log('post trip', error.message)
    alert(`This area already has a trip on ${date}!`)
  })
}

export const addTrip = trip => ({
  type: actionType.POST_TRIP,
  payload: trip
});

export const updateTrip = (_id, date, token) => async dispatch => {
  await fetch(baseUrl + 'trips', {
    method: 'PUT',
    body: JSON.stringify({_id, date}),
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
      console.log('Update trip', error.message)
      alert(`Trip ${date} could not be updated.`)
  })
  dispatch(fetchTrips(token))
}

export const addMember = (_id, member) => async dispatch => {
  try {
    const response = await fetch(baseUrl + 'trips', {
      method: 'PUT',
      body: JSON.stringify({_id, member}),
      headers: {'content-type': 'application/json'}
    })

    if (!response.ok) {
      const err = response.message
      throw err
    }

    const trip = await response.json()
    dispatch(addTripInfo(trip))
  } catch(err) {
    console.log('err', err)
    alert('Request could not be completed')
  }
}

export const addImageToTrip = (tripId, uri) => async dispatch => {
  const fileName = uri.split('/').pop();
  const newPath = FileSystem.documentDirectory + fileName;
  console.log('newPath', newPath)
  try {
    await FileSystem.moveAsync({
      from: uri,
      to: newPath
    });
    const response = await fetch(baseUrl + 'trips', {
      method: 'PUT',
      body: JSON.stringify({_id: tripId, uri: newPath}),
      headers: {'content-type': 'application/json'}
    })
    if (!response.ok) {
      const err = new Error(`${response.msg}`)
      throw err
    }
    const trip = await response.json()
    dispatch(addTripInfo(trip))
  } catch(err) {
    alert('Request could not be completed')
    throw err
  }
}

export const addNoteToTrip = (tripId, note) => async dispatch => {
  try {
    const date = new Date().toDateString()
    const response = await fetch(baseUrl + 'trips', {
      method: 'PUT',
      body: JSON.stringify({_id: tripId, note, date}),
      headers: {'content-type': 'application/json'}
    })
    if (!response.ok) {
      const err = response.msg
      alert(err)
    }
    const trip = await response.json()
    dispatch(addTripInfo(trip))
  } catch(err) {
    alert('Request could not be completed')
    throw err
  }
}

export const updateTripNote = (tripId, noteId, note) => async dispatch => {
  try {
    const response = await fetch(baseUrl + 'trips', {
      method: 'PUT',
      body: JSON.stringify({_id: tripId, noteId, note}),
      headers: {'content-type': 'application/json'}
    })
    if (!response.ok) {
      const err = response.msg
      alert(err)
    }
    const trip = await response.json()
    dispatch(addTripInfo(trip))
  } catch(err) {
    alert('Request could not be completed')
    throw err
  }
}

const addTripInfo = info => ({
  type: actionType.ADD_TRIP_INFO,
  payload: info
})

export const deleteTrip = (_id, token) => async dispatch => {
  await fetch(baseUrl + 'trips', {
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
    console.log('Delete trip', error.message)
    alert(`Trip could not be deleted`)
  })
  dispatch(fetchTrips(token))
}