import React, {useState} from "react";
import Main from "./components/mainComponent";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {reducers} from './redux/rootReducer';
import {UserContext} from './components/userContextComponent';
import {SearchContext, ViewSearch} from './components/CreateContextComponents/searchContext';

const store = createStore(reducers, applyMiddleware(logger, thunk));

export default function App() {
  const [user, setUser] = useState()
  const [searchText, setSearchText] = useState()
  const [viewSearch, setViewSearch] = useState(false)
  return (
    <Provider store={store}>
      <UserContext.Provider value={{value: [user, setUser]}}>
        <SearchContext.Provider value={{value: [searchText, setSearchText]}}>
          <ViewSearch.Provider value={{bool: [viewSearch, setViewSearch]}}>
            <Main />
          </ViewSearch.Provider>
        </SearchContext.Provider>
      </UserContext.Provider>
    </Provider>
  );
}
