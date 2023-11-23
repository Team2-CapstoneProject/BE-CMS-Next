import Swal from 'sweetalert2';
import axios from 'axios';

import {
  loginRequestRed,
  loginSuccessRed,
  loginFailureRed,
  logoutRed,
  setAuthState,
} from "../reducers/AuthReducer";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
  payload: { user: null, token: null, error: null, isLoggedIn: false }
});

export const loginSuccess = (user, token) => ({
  type: LOGIN_SUCCESS,
  payload: { user, token, error: null, isLoggedIn: true }
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: { user: null, error, isLoggedIn: false }
});

export const logout = () => ({
  type: LOGOUT,
  payload: { user: null, token: null, error: null, isLoggedIn: false }
});

export const loginUser = (credentials, navigate) => {
  return async (dispatch) => {
    dispatch(loginRequestRed());

    try {
      const response = await axios.post('/api/auth/login', credentials);

      dispatch(loginSuccessRed({ user:response.data.user, token: response.data.token}));
      localStorage.setItem('token', response.data.token);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You have successfully logged in!',
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      navigate.push('/dashboard');
    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Incorrect username or password. Please try again.',
      });

      dispatch(loginFailureRed(error.response ? error.response.data.error : 'An error occurred'));
    }
  };
};


export const logoutUser = (navigate) => {
  return async (dispatch) => {
    try {
      dispatch(logoutRed())
        .then(() => {
          // console.log('2');
          navigate.push("/login");
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

}