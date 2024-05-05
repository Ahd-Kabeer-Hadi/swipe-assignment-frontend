import { createSlice } from "@reduxjs/toolkit";

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push(action.payload);
    },
    deleteInvoice: (state, action) => {
      return state.filter((invoice) => invoice.id !== action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedInvoice;
      }
    },
    bulkUpdateInvoices : (state, action) => {
      const { updatedInvoices = [] } = action.payload;
      updatedInvoices.forEach(invoice => {
        const index = state.findIndex(
          (invoice) => invoice.id === invoice.id
        );
        if (index !== -1) {
          state[index] = invoice;
        }
      })
    }
   
  },
});

export const {
  addInvoice,
  deleteInvoice,
  updateInvoice,
  bulkUpdateInvoices
} = invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;

export default invoicesSlice.reducer;
