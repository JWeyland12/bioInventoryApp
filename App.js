import React from "react";
import Main from "./components/mainComponent";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {reducers} from './redux/rootReducer';

const store = createStore(reducers, applyMiddleware(logger, thunk));

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
