import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import exp from "constants";
import { Contract, BigNumber, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import hre, { ethers } from "hardhat";

describe("Salman Token", function async() {

  let signers: Signer[];

  let ercToken: Contract;
  let owner:SignerWithAddress;
  let user:SignerWithAddress;
  let user2:SignerWithAddress;


  before(async () => {
     [owner, user,user2] = await ethers.getSigners();

    hre.tracer.nameTags[owner.address] = "ADMIN";
    hre.tracer.nameTags[user.address] = "USER1";
    hre.tracer.nameTags[user2.address] = "USER2";

    const Salman20 = await ethers.getContractFactory("Salman20", owner);
    ercToken = await Salman20.deploy();
   
  });


  // it("should return TokenName", async function () {

  //   console.log(ercToken.functions)
  //   expect(await ercToken.callStatic.name()).to.be.equal("Asad")

  //   await ercToken.approve(user.address,parseEther("1000"))

  //   console.log(await ercToken.callStatic.symbol())

  //   expect(await ercToken.callStatic.symbol()).to.be.equal("RT")
  // })

  it("1 Should return Token Name", async function () {
    expect(await ercToken.callStatic.name()).to.be.equal("Salman");  
  });

  it("2 Should return symbol", async function () {
    expect(await ercToken.callStatic.symbol()).to.be.equal("SY")
  });

  it("3 Should return total supply", async function () {
    expect(await ercToken.callStatic.totalSupply()).to.be.equal(parseEther("10000"));
  });

  it("4 should return BalanceOf", async function () {
    expect(await ercToken.callStatic.balanceOf(owner.address)).to.be.equal(parseEther("10000"));
  });

  it("5 should return hte decimals", async function () {
    expect(await ercToken.callStatic.decimals()).to.be.equal(BigNumber.from("18"));
  });

  it("6 should return transfer token", async function () {
    await ercToken.transfer(user.address,parseEther("10"));
    expect(await ercToken.callStatic.balanceOf(user.address)).to.be.equal(parseEther("10"));
  });

  it("7 should return Allowance", async function () {
    await ercToken.callStatic.allowance(owner.address,user.address)
  });

  it("8 should return Approve", async function () {
    await ercToken.approve(user.address,parseEther("30")); 
  });

  it("9 should return transferFrom", async function () {
    await expect(()=> ercToken.connect(user).transferFrom(owner.address,user2.address, parseEther("2")))
    .changeTokenBalances(ercToken,[owner,user2],[parseEther("-2"),parseEther("2")])
  });

  it("10 should increase allowance", async function () {
    expect(await ercToken.increaseAllowance(user.address,1000))
    
  });

  it("11 should decrease allowan", async function () {
    await ercToken.connect(owner).decreaseAllowance(user.address,2)
    
  });

  it("12 should Burn", async function () {
    expect (await ercToken.burn(parseEther("20")))
  })

 
});
