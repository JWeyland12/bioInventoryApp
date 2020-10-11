import * as actionType from "../actionTypes";
import { baseUrl } from "../../shared/baseUrl";

export const fetchTrips = () => (dispatch) => {
  fetch(baseUrl + "trips")
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
