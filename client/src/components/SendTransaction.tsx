import React, { FormEvent, useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Actions, SendTransactionProps } from "../types";
import { isValidField } from "../utils/validField";
import { convertToWei, formattedNumberWithCommas } from "../utils/formatNumber";
import { RootState } from "../store/reducers";
import { navigate } from "./NaiveRouter";

//AP-FIX-EXTRA - added prop to component to auto-populate the sender field with the user's wallet's address
const SendTransaction: React.FC<SendTransactionProps> = ({ senderAddress }) => {
  const transactionId = useSelector((state: RootState) => state.transactionId);
  const dispatch = useDispatch();

  //AP-FIX-5 - Added state to monitor inputs values and errors
  const initialState = {
    sender: senderAddress ? senderAddress : "",
    recipient: "",
    amount: 0,
    error: {
      sender: null,
      recipient: null,
      amount: null,
    },
  };
  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "sender":
        return { ...state, sender: action.value };
      case "recipient":
        return { ...state, recipient: action.value };
      case "amount":
        return { ...state, amount: action.value };
      case "error":
        return { ...state, error: action.value };
      case "clearAll":
        return initialState;
      default:
        break;
    }
  };
  const [state, setState] = useReducer(reducer, initialState);

  //AP-FIX-EXTRA - Changed form display from data-hs-overlay/hs-overlay-open classes to state, values cleared on close
  const [open, setOpen] = useState(false);
  const dismiss = () => {
    setOpen(!open);
    setState({ type: "clearAll", value: null });
  };

  //AP-FIX-4 Redirect to the single transaction page after successful dispatch (transaction creation) and state update
  useEffect(() => {
    if (transactionId) {
      navigate(`./transaction/${transactionId}`);
      dispatch({
        type: Actions.ClearTransactionId,
      });
    }
  }, [transactionId, dispatch]);

  //AP-FIX-5 - dispatch with payload so form data is available in the saga
  const handleDispatch = (e: FormEvent) => {
    e.preventDefault();
    //field validation - value needs to be a type address: 0x{40 characters from [0-9a-fA-F]}
    let errors: any = {};
    const isSenderValid =
      state.sender.length > 0 && isValidField("sender", state.sender);
    if (!isSenderValid) errors["sender"] = "Invalid input";

    const isRecipientValid =
      state.recipient.length > 0 && isValidField("recipient", state.recipient);
    if (!isRecipientValid) errors["recipient"] = "Invalid input";

    const isAmountValid = isValidField("amount", state.amount);
    if (!isAmountValid) errors["amount"] = "Invalid input";

    if (Object.keys(errors).length > 0) {
      setState({ type: "error", value: errors });
      return;
    }

    dispatch({
      type: Actions.SendTransaction,
      payload: {
        value: convertToWei(state.amount),
        sender: state.sender,
        recipient: state.recipient,
      },
    });
    dismiss();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
      >
        Send
      </button>

      <form onSubmit={handleDispatch}>
        <div
          id="hs-basic-modal"
          className={`hs-overlay w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto bg-black bg-opacity-60 ${
            !open && "hidden"
          }`}
        >
          <div className="opacity-100  opacity-100 transition-all w-full m-3 mx-auto flex flex-col h-full items-center justify-center">
            <div className="bg-white border shadow-sm rounded-xl w-modal">
              <div className="flex justify-between items-center py-3 px-4 border-b">
                <h3 className="font-bold text-gray-800 text-xl">
                  Send Transaction
                </h3>
                <button
                  type="button"
                  className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm"
                  onClick={dismiss}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-3.5 h-3.5"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <p className="mt-1 mb-6 text-gray-800">
                  Send ETH to a wallet address
                </p>
                <label
                  htmlFor="input-sender"
                  className="block text-sm font-bold my-2"
                >
                  Sender:
                </label>
                {/* //AP-FIX-5 - Changing input attributes to make them usable and access their value, also removed class 'pointer-event-none' */}
                <input
                  type="text"
                  id="input-sender"
                  value={state.sender}
                  onChange={(e) =>
                    setState({ type: "sender", value: e.target.value })
                  }
                  className="opacity-70 py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                  placeholder="Sender Address (Autocompleted)"
                  required
                />
                {!!state.error.sender && (
                  <p className="text-red-600">{state.error.sender}</p>
                )}
                <label
                  htmlFor="input-recipient"
                  className="block text-sm font-bold my-2"
                >
                  Recipient:
                </label>
                <input
                  type="text"
                  id="input-recipient"
                  value={state.recipient}
                  onChange={(e) =>
                    setState({ type: "recipient", value: e.target.value })
                  }
                  className="opacity-70 py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                  placeholder="Recipient Address"
                  required
                />
                {!!state.error.recipient && (
                  <p className="text-red-600">{state.error.recipient}</p>
                )}
                <label
                  htmlFor="input-amount"
                  className="block text-sm font-bold my-2"
                >
                  Amount:
                </label>
                <input
                  type="number"
                  id="input-amount"
                  value={state.amount === 0 ? "" : state.amount}
                  onChange={(e) =>
                    setState({ type: "amount", value: e.target.value })
                  }
                  className="opacity-70 py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                  placeholder="Amount"
                  required
                />
                {!!state.error.amount && (
                  <p className="text-red-600">{state.error.amount}</p>
                )}
                {/*AP-FIX-7 - show equivalent ETH and WEI values*/}
                <p className="text-gray-600">
                  You are sending {formattedNumberWithCommas(state.amount)} ETH.
                  This represents{" "}
                  {formattedNumberWithCommas(convertToWei(state.amount))} WEI.
                </p>
              </div>
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                <button
                  type="button"
                  className="hs-dropdown-toggle py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
                  onClick={dismiss}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SendTransaction;
