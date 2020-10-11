import { combineReducers } from 'redux';
import {projectRed} from './reducers/projects';

export const reducers = combineReducers({
  projects: projectRed
})