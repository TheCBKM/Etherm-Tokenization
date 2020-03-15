import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAdderess: "0x123...", tokenSaleAddress: null, userTokens: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.kycContractInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );


      // Set web3, accounts, and contract to the state, and then proceed with an

      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({ loaded: true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address }, this.updateUserTokens)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call()
    this.setState({ userTokens })
  }
  listenToTokenTransfer = () => {
    this.tokenInstance.events.Transfer({ to: this.accounts[0] }).on("data", this.updateUserTokens)
  }
  handelBuyTokens = async () => {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({ from: this.accounts[0], value: 1 });
  }


  handelInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }
  handelKyc = async () => {
    await this.kycContractInstance.methods.setKycCompleted(this.state.kycAdderess).send({ from: this.accounts[0] })
    alert(`KYC for ${this.state.kycAdderess} done !!`)
  }


  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>StarDucks Cappucino Token Sale!</h1>
        <p>Get Your token today</p>
        <h2>KYC whitelisting</h2>
       Address to allow<input type="text" name="kycAdderess" value={this.state.kycAdderess} onChange={this.handelInputChange} />
        <button type="button" onClick={this.handelKyc}>Add to Whitelist</button>
        <h2>Buy Tokens</h2>
        <p>If you want to Buy tokens,send wei to :{this.state.tokenSaleAddress} </p>
        <p>you currently have :{this.state.userTokens} CAP</p>
        <button onClick={this.handelBuyTokens}> Buy More token</button>
      </div>
    );
  }
}

export default App;
