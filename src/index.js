/* Imports */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import { Provider, useDispatch, useSelector } from 'react-redux';

/* Component Import */
import store from './store/store';
import App from './components/App';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';

/* Sematic UI Import */
import 'semantic-ui-css/semantic.min.css'
import Spinner from './common/Spinner';
import appFirebase from './firebase';
import { CLEAR_USER, SET_USER } from './actions/types';

const RootApp = () => {

  const isLoading = useSelector(state => state.user_reducer.isLoading);
  const history = useHistory();
  const dispatch = useDispatch();

  /* Check if Already logged In */
  useEffect(() => {
    appFirebase.auth().onAuthStateChanged(user => {
      if (user) {
        /* Set user in the store */
        dispatch({
          type: SET_USER,
          payload: {
            email: user.email,
            id: user.uid,
            displayName: user.displayName,
            avatar: user.photoURL
          }
        })
        history.push('/')
      } else {
        history.push('/login')
        dispatch({
          type: CLEAR_USER
        })
      }
    });
  });

  return (
    isLoading ? <Spinner /> :
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <RootApp />
      </Router>
    </Provider >
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
