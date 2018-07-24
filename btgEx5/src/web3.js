//overrides metamask v0.2 for our 1.0 version. 
//1.0 lets us use async and await instead of promises
import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/foo',
  );
  web3 = new Web3(provider);
}

export default web3;