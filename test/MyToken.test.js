const Token = artifacts.require("MyToken")

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

contract("token Test", async (acc) => {

    beforeEach(async () => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })
    const [deployer, recipent, another] = acc

    it("all token should be in my account", async () => {
        let instance = this.myToken
        let totalSupply = await instance.totalSupply();
        return expect(await instance.balanceOf(deployer)).to.be.a.bignumber.equal(totalSupply);
    })

    it("Is possible to send token betweens acounts", async () => {
        const sendTokens = 1;

        let instance = this.myToken
        let totalSupply = await instance.totalSupply();
        expect(await instance.balanceOf(deployer)).to.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipent, sendTokens)).to.eventually.be.fulfilled;
        expect(await instance.balanceOf(deployer)).to.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(await instance.balanceOf(recipent)).to.be.a.bignumber.equal(new BN(sendTokens));


    })
    it("It is not possible to send more token than available in total ", async () => {
        let instance = this.myToken
        let balanceOfDeployer = await instance.balanceOf(deployer);

        expect(instance.transfer(recipent, new BN(balanceOfDeployer + 1))).to.eventually.be.rejected;
        return  expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(balanceOfDeployer);

    })
}) 