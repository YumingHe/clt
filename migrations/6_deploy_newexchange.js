const NewExchange = artifacts.require("./NewExchange.sol");
const AskHeap = artifacts.require("./AskHeap.sol");
const BidHeap = artifacts.require("./BidHeap.sol");

module.exports = function(deployer) {
  deployer.deploy(AskHeap);
  deployer.deploy(BidHeap);
  deployer.link(AskHeap, NewExchange);
  deployer.link(BidHeap, NewExchange);
  deployer.deploy(NewExchange, {gas: 10000000});
};