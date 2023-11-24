import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import {
  FETCH_DASHBOARD_DATA_REQUEST,
  FETCH_DASHBOARD_DATA_SUCCESS,
  FETCH_DASHBOARD_DATA_FAILURE,
  FETCH_VILLAS_REQUEST,
  FETCH_VILLAS_SUCCESS,
  FETCH_VILLAS_FAILURE,
  ADD_VILLA_SUCCESS,
  ADD_VILLA_FAILURE,
  EDIT_VILLA_SUCCESS,
  EDIT_VILLA_FAILURE,
  DELETE_VILLA_SUCCESS,
  DELETE_VILLA_FAILURE,
} from "../actions/DashboardActions";

const initialState = {
  villas: [],
  deleting: false,
  success: false,
  data: null,
  loading: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    fetchRequest(state, action) {
      console.log("fetch loading.");
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    fetchDataDashboardSuccess(state, action) {
      console.log("data fetch dashboard success:", action.payload);
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    },
    fetchDataVilaSuccess(state, action) {
      console.log("data fetch vila success:", action.payload);
      return {
        ...state,
        loading: false,
        villas: action.payload,
        error: null,
      };
    },
    addDataVilaSuccess(state, action) {
      console.log("data add vila success:", action.payload);
      return {
        ...state,
        villas: [...state.villas, action.payload],
        loading: false,
        error: null,
      };
    },
    editDataVilaSuccess(state, action) {
      console.log("data edit vila success:", action.payload);
      const updatedVilla = action.payload;
      const updatedVillas = state.villas.map((villa) =>
        villa.id === updatedVilla.id ? updatedVilla : villa
      );

      return {
        ...state,
        villas: updatedVillas,
        loading: false,
        error: null,
      };
    },
    deleteDataVilaSuccess(state, action) {
      console.log("data delete vila success.");
      return {
        ...state,
        deleting: false,
        success: true,
        error: null,
      };
    },
    fetchFailure(state, action) {
      console.log("data fetch dashboard failed:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },

    setDashboardState(state, action) {
      // console.log("tes");
      switch (action.type) {
        case FETCH_DASHBOARD_DATA_REQUEST:
        case FETCH_VILLAS_REQUEST:
          return {
            ...state,
            loading: true,
            error: null,
          };

        case FETCH_DASHBOARD_DATA_SUCCESS:
          return {
            ...state,
            loading: false,
            data: action.payload,
            error: null,
          };

        case FETCH_VILLAS_SUCCESS:
          return {
            ...state,
            loading: false,
            villas: action.payload,
            error: null,
          };

        case ADD_VILLA_SUCCESS:
          return {
            ...state,
            villas: [...state.villas, action.payload],
            loading: false,
            error: null,
          };

        case EDIT_VILLA_SUCCESS:
          const updatedVilla = action.payload;
          const updatedVillas = state.villas.map((villa) =>
            villa.id === updatedVilla.id ? updatedVilla : villa
          );

          return {
            ...state,
            villas: updatedVillas,
            loading: false,
            error: null,
          };

        case DELETE_VILLA_SUCCESS:
          return {
            ...state,
            deleting: false,
            success: true,
            error: null,
          };

        case FETCH_DASHBOARD_DATA_FAILURE:
        case FETCH_VILLAS_FAILURE:
        case ADD_VILLA_FAILURE:
        case EDIT_VILLA_FAILURE:
        case DELETE_VILLA_FAILURE:
          return {
            ...state,
            loading: false,
            error: action.payload,
          };

        default:
          return state;
      }
    },
  },
});

export const {
  fetchRequest,
  fetchDataDashboardSuccess,
  fetchDataVilaSuccess,
  addDataVilaSuccess,
  editDataVilaSuccess,
  deleteDataVilaSuccess,
  fetchFailure,
  setDashboardState,
} = dashboardSlice.actions;

export const selectDashboardState = (state) => state.dashboard.dashboardState;

export default dashboardSlice.reducer;
