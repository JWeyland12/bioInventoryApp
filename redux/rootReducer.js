import { combineReducers } from 'redux';
import {projectRed} from './reducers/projects';
import {areaRed} from './reducers/areas'
import {tripRed} from './reducers/trips';
import {speciesRed} from './reducers/species';
import {userReducer} from './reducers/auth';
import {speciesListRed} from './reducers/speciesList';

export const reducers = combineReducers({
  projects: projectRed,
  areas: areaRed,
  trips: tripRed,
  species: speciesRed,
  user: userReducer,
  speciesList: speciesListRed
})