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