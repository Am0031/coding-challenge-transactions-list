import { Actions } from "../types";

// Define the state type
export interface RootState {
  transactions: any[];
  transactionId: string | null;
}

// Initial state
const initialState: RootState = {
  transactions: [],
  transactionId: null,
};

const reducer = (state = initialState, action: any): RootState => {
  switch (action.type) {
    //AP-FIX-4 - Added actions relevant for redirection after successful transaction
    case Actions.TransactionSuccess:
      return {
        ...state,
        transactionId: action.payload,
      };
    case Actions.ClearTransactionId:
      return { ...state, transactionId: null };
    default:
      return state;
  }
};

export default reducer;
