import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "../actions/AuthActions";

const initialState = {
  user: null,
  token: null,
  error: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequestRed(state, action) {
      // console.log("login loading.");
      return {
        ...state,
        user: null,
        token: null,
        error: null,
        isLoggedIn: false,
      };
    },
    loginSuccessRed(state, action) {
      // console.log("data fetch login success:", action.payload);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        isLoggedIn: true,
      };
    },
    loginFailureRed(state, action) {
      // console.log("data fetch login failed:", action.payload);
      return {
        ...state,
        user: null,
        error: action.payload,
        isLoggedIn: false,
      };
    },
    logoutRed(state, action) {
      // console.log("data fetch logout.");
      return {
        ...state,
        user: null,
        token: null,
        error: null,
        isLoggedIn: false,
      };
    },
    setAuthState(state, action) {
      state.authState = action.payload;
      // switch (action.type) {
      //   case LOGIN_REQUEST:
      //     return {
      //       ...state,
      //       user: null,
      //       token: null,
      //       error: null,
      //       isLoggedIn: false,
      //     };
      //   case LOGIN_SUCCESS:
      //     return {
      //       ...state,
      //       user: action.payload.user,
      //       token: action.payload.token,
      //       error: null,
      //       isLoggedIn: true,
      //     };
      //   case LOGIN_FAILURE:
      //     return {
      //       ...state,
      //       user: null,
      //       error: action.payload,
      //       isLoggedIn: false,
      //     };
      //   case LOGOUT:
      //     return initialState;
      //   default:
      //     return state;
      // }
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {
  //       ...state,
  //       ...action.payload.auth,
  //     };
  //   },
  // },
});

export const {
  loginRequestRed,
  loginSuccessRed,
  loginFailureRed,
  logoutRed,
  setAuthState,
} = authSlice.actions;

export const selectAuthState = (state) => state.auth.authState;

export default authSlice.reducer;
