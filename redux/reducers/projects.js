import * as actionTypes from '../actionTypes';

export const projectRed = (
  state = {
    projects: []
  },
  action
) => {
  switch (action.type) {
    case actionTypes.ADD_PROJECTS:
      return {...state, projects: action.payload}
    case actionTypes.POST_PROJECT:
      return {...state, projects: state.projects.concat(action.payload)}
    default:
      return state;
  }
}

// case actionTypes.PUT_PROJECT:
    //   console.log(`action.payload: ${action.payload}`)
    //     return {...state, 
    //       projects: state.projects.map(
    //         (project, i) => i === [action.payload._id] ? {project: action.payload} : project
    //       )}