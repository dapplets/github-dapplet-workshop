const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("gitHubDapplet", function () {
  let contract;
  let accountAddress;

  beforeEach(async function () {
    const [acc1] = await ethers.getSigners();
    accountAddress = acc1.address;

    const GitHubDapplet = await ethers.getContractFactory("GitHubDapplet", acc1);
    const gitHubDapplet = await GitHubDapplet.deploy();
    await gitHubDapplet.deployed();
    contract = gitHubDapplet;
  });

  it('adds like', async () => {
    await contract.addLike('1212');
    const accountsByCommentd = await contract.getAccountsByCommentId('1212');
    expect(accountsByCommentd).to.eql([accountAddress]);
  });
  
  it('adds two likes', async () => {
    await contract.addLike('1212');
    await contract.addLike('121233');
    const allLikes = await contract.getAll();
    expect(allLikes).to.eql([['1212', [accountAddress]], ['121233', [accountAddress]]]);
  });
  
  it('removes likes', async () => {
    await contract.addLike('1212');
    await contract.removeLike('1212');
    const accountsByCommentd = await contract.getAccountsByCommentId('1212');
    expect(accountsByCommentd).to.eql([]);
  });
});
