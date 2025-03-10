import { takeEvery, put } from "redux-saga/effects";
import {
  JsonRpcProvider,
  Transaction,
  TransactionResponse,
  TransactionReceipt,
  BrowserProvider,
  Signer,
  TransactionRequest,
} from "ethers";

import apolloClient from "../apollo/client";
import { Actions } from "../types";
import { SaveTransaction } from "../queries";

function* sendTransaction(action: any): any {
  //AP-FIX-5 - access payload information
  const { value, sender, recipient } = action.payload;

  const provider = new JsonRpcProvider("http://localhost:8545");

  const walletProvider = new BrowserProvider(window.web3.currentProvider);

  const signer: Signer = yield walletProvider.getSigner();

  const accounts: Array<{ address: string }> = yield provider.listAccounts();

  const randomAddress = () => {
    const min = 1;
    const max = 19;
    const random = Math.round(Math.random() * (max - min) + min);
    return accounts[random].address;
  };

  //AP-FIX-5 - assign payload information to the transaction
  const transaction: TransactionRequest = {
    to: randomAddress(), //could take recipient from payload
    value: value ? value : 1000000000000000000, //value from payload - amount passed here in WEI from form
  };

  try {
    //AP-FIX-3 Added the populating of the transaction first before sending it
    const tx = yield signer.populateTransaction(transaction);
    const txResponse: TransactionResponse = yield signer.sendTransaction(tx);

    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || "0",
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString()) || "0",
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || "",
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || "123456",
        hash: receipt.hash,
      },
    };
    yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables,
    });
    //AP-FIX-4 - dispatch an action with the transaction hash for the new created transaction
    yield put({ type: Actions.TransactionSuccess, payload: receipt.hash });
  } catch (error) {
    console.log("error on sendTransation function", error);
  }
}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction);
}
