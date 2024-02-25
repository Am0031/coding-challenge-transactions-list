# Web App Developer Coding Challenge

This coding challenge is to fix several issues within a pre-existing application that simulates Ethereum native token transactions.

## Setting up Notes

Using the project on windows: edit docker_run.sh to be on EOL conversion = Unix(LF)

Mongo: configured dockerfile to not conflict with local instance of mongo db

## Tasks and Resolution measures

Resolutions are flagged in the code with comments starting with 'AP-FIX'.

### 1. GraphQL Query

Problem: graphql validation error

Resolution: removed the field 'receipt' from getAllTransactions graphql string as it is not a field on the schema.

### 2. Wallet Connection

Problem: metamask connection failing

Resolution: installed and imported @web3-onboard/metamask, then instantiated the wallet with metamaskSDK, and passed this wallet in the wallets array of the Onboard options object.

### 3. Redux Saga

Problem: **`SEND_TRANSACTION`** saga failing at the sendTransaction stage.

Resolution: populated Transaction before sending it

### 4. Navigation & Redirection

Problem: no redirect to the new transaction's page after successful transaction.

Resolution: Steps:

- Added a dispatch action after the successful DB mutation to save the new transaction hash in the redux store (under transactionId)
- Added monitoring of the transactionId in the SendTransaction component. On change, navigate to the single transaction page for that transaction

### 5. Wire in the Form

Problem: Send form not functional.

Resolution: Steps:

- inputs fields made accessible (remove disabled attribute) and required
- added useReducer to make component responsible of monitoring the inputs' changes
- button type changed to type submit for basic validation on required fields
- On send, further validation applied:
  - sender and recipients values expected to to be format of a 42 hexadecimal string _(40 characters + the `0x` prefix)_,
  - amount > 0.
- Added display elements for validation fail
- On successful send, modal is closed and inputs' values are reset.
- On Cancel or X button click, modal is closed and inputs' values are reset.
- Prepopulated sender field with connected wallet's address.
- Added payload to dispatch action so sendTransaction saga function has access to form data

### 6. UI

Problem: "Connect Wallet" button and the "Send" button disappear under screen width of 640px.

Resolution: tailwind classes changed on elements in the Navigation component for better flex behaviour, and wallet address box hidden on small screens for better navbar layout.

![mobile-view-connect](image.png)
![mobile-view-send](image-1.png)

### 7. Human Readable Values

Problem: transaction values need to be human-readable format _(from WEI to ETH)_. This is relevant for the transaction list, the single page transaction views and the form.

Resolution: installed numeral package and added utils functions for conversion and display formatting, applied it on fields in transaction cards, single transaction details, and on form.

Conversion display at bottom of form:

![conversion-form](image-2.png)

Transaction details on single transaction page:

![transaction-details-page](image-3.png)

Corresponding transaction in the DB:

![transaction-details-db](image-4.png)

## Further fixes

Suggestion for further fixes to investigate:

- Branching strategy
- Add tests for all pages and functionalities
- Further styling cleanup
- Form: add field validation on change or blur rather than only on form submit
