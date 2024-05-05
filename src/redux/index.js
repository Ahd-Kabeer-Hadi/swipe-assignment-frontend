import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice"; // Import your other reducers
import productReducer from "./productsSlice";

const rootReducer = combineReducers({
  invoices: invoicesReducer,
  products : productReducer
});

export default rootReducer;
