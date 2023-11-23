import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "@/redux/reducers/AuthReducer";
import { dashboardSlice } from "@/redux/reducers/DashboardReducer";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [dashboardSlice.name]: dashboardSlice.reducer,
  },
});

export default store;
