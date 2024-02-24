import { takeEvery } from "redux-saga/effects";
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
import { convertToWei } from "../utils/formatNumber";

function* sendTransaction(action: any) {
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
    to: randomAddress(), //could take recipient if it was a valid one
    // value: 10, //amount passed here in ETH or WEI?
  };

  console.log(transaction, sender, recipient, value);

  try {
    //AP-FIX-3 Added the populating of the transaction first before sending it
    signer.populateTransaction(transaction);
    const txResponse: TransactionResponse = yield signer.sendTransaction(
      transaction
    );

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
  } catch (error) {
    console.log("error on sendTransation function", error);
  }
}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction);
}
