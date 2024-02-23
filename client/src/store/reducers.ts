// Define the state type
export interface RootState {
  transactions: any[];
}

// Initial state
const initialState: RootState = {
  transactions: [],
};

const reducer = (state = initialState, action: any): RootState => {
  switch (action.type) {
    // Define your actions
    //for fix AP-FIX-4 add redirect to SingleTransaction page on successful send - where?
    default:
      return state;
  }
};

export default reducer;
