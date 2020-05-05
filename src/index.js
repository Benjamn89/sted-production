import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import logOnReducer from "./REDUCERS/00-LOG-PAGE/log-on-reducer";
import NavbarReducer from "./REDUCERS/01-NAVBAR/navbar-reducer";
import PostsReducer from "./REDUCERS/02-HOME-PAGE/00-POSTS-BOX/posts-box-reducer";
import ProfileBoxReducer from "./REDUCERS/02-HOME-PAGE/01-PROFILE-BOX/profile-box-reducer";
import CommentsReducer from "./REDUCERS/02-HOME-PAGE/02-COMMENTS/comments-reducer";
import ProfilePageReducer from "./REDUCERS/03-PROFILE-PGAE/profile-page-reducer";
import UsersReducer from "./REDUCERS/04-USERS/users-reducer";

const rootReducer = combineReducers({
  logOnReducer,
  NavbarReducer,
  PostsReducer,
  ProfileBoxReducer,
  CommentsReducer,
  ProfilePageReducer,
  UsersReducer,
});

const logger = (store) => {
  return (next) => {
    return (action) => {
      const result = next(action);
      return result;
    };
  };
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(logger, thunk))
);

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
