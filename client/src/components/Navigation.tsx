import React, { useCallback, useState } from "react";
import Onboard, { WalletState } from "@web3-onboard/core";
//AP-FIX-2 - Adding @web3-onboard/metamask as per metamask documentation when using web3-onboard library
import metamaskSDK from "@web3-onboard/metamask";
import SendTransaction from "./SendTransaction";

//AP-FIX-2 - Adding instantiation of the module as per metamask documentation when using web3-onboard library
const metamaskSDKWallet = metamaskSDK({
  options: {
    extensionOnly: false,
    dappMetadata: {
      name: "Example Web3-Onboard Dapp",
    },
  },
});

const onboard = Onboard({
  wallets: [metamaskSDKWallet],
  chains: [
    {
      id: "123456",
      token: "ETH",
      label: "Local Ganache",
      rpcUrl: "http://localhost:8545",
    },
  ],
});

const Navigation: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>();

  const handleConnect = useCallback(async () => {
    try {
      const wallets = await onboard.connectWallet();

      //AP-FIX-2 adding check on wallets to avoid error if user closes wallet popup before selecting a wallet
      if (!wallets.length) {
        return;
      }

      const [metamaskWallet] = wallets;

      if (
        metamaskWallet.label === "MetaMask" &&
        metamaskWallet.accounts[0].address
      ) {
        setWallet(metamaskWallet);
      }
    } catch (error) {
      console.error("wallet connection error", error);
    }
  }, []);

  //AP-FIX-6 - amended classes for buttons display on small screens (hiding address tag /only showing send button on small screens)
  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-ful text-sm py-4 bg-gray-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 flex sm:items-center justify-between">
        <div className="flex items-center justify-between">
          <a className="flex-none text-xl font-semibold text-white" href=".">
            Transactions List
          </a>
        </div>
        <div className="hs-collapse overflow-hidden transition-all duration-300 sm:block">
          <div className="flex gap-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
            {wallet && (
              <>
                <SendTransaction senderAddress={wallet.accounts[0].address} />
                <p className="py-3 px-4 hidden sm:block inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 text-sm">
                  {wallet.accounts[0].address}
                </p>
              </>
            )}
            {!wallet && (
              <button
                type="button"
                onClick={handleConnect}
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 hover:text-white hover:bg-gray-500 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
