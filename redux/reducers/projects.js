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
    case actionTypes.LOG_OUT:
      return {projects: []}
    case actionTypes.DELETE_PROJECT_INFO:
      const index = state.projects.findIndex(i => i._id.toString() === action.payload._id.toString())
      console.log('index', index)
      state.projects.splice(index, 1, action.payload)
      console.log('projects', state.projects)
      return {...state}
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