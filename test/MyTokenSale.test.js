const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");

require("dotenv").config({
    path: "../.env"
})

const chai = require("chai");

const BN = web3.utils.BN;
// const BN = require('bn.js');
const chainBN = require("chai-bn")(BN);
chai.use(chainBN)

const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised)

const expect = chai.expect;

contract("TokenSale", async function (accounts) {
    const [initialHolder, recipient, anotherAccount] = accounts;
    it("there shouldnt be any coins in my account", async () => {
        let instance = await Token.deployed();
        return expect(instance.balanceOf.call(initialHolder)).to.eventually.be.a.bignumber.eq
        ual(new BN(0));
    });
    it("all coins should be in the tokensale smart contract", async () => {
        let instance = await Token.deployed();
        let balance = await instance.balanceOf.call(TokenSale.address);
        let totalSupply = await instance.totalSupply.call();
        return expect(balance).to.be.a.bignumber.equal(totalSupply);
    });
    it("should be possible to buy one token by simply sending ether to the smart contract", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);
        expect(tokenSaleInstance.sendTransaction({
            from: recipient, value: web3.utils.toWei("1",
                "wei")
        })).to.be.rejected;
        expect(balanceBeforeAccount).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient));
        let kycInstance = await KycContract.deployed();
        await kycInstance.setKycCompleted(recipient);
    });
})