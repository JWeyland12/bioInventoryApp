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
        const newState = {...state, projects: state.projects.concat(action.payload)}
        return newState.projects.sort((a, b) => {a > b ? 1 : -1})
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