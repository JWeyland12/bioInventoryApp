import React, {useState} from "react";
import Main from "./components/mainComponent";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {reducers} from './redux/rootReducer';
import {UserContext} from './components/userContextComponent';

const store = createStore(reducers, applyMiddleware(logger, thunk));

export default function App() {
  const [user, setUser] = useState()
  return (
    <Provider store={store}>
      <UserContext.Provider value={{value: [user, setUser]}}>
        <Main />
      </UserContext.Provider>
    </Provider>
  );
}
