pragma solidity ^0.4.24;

import "../libraries/AskHeap.sol";
import "../libraries/OrderNode.sol";

contract TestAskHeap {
  using AskHeap for AskHeap.Tree;

  AskHeap.Tree data;

  function add(uint64 id, address owner, address baseToken, address tradeToken, uint price, uint amount, uint64 timestamp) public {
    data.add(OrderNode.Node(id, owner, baseToken, tradeToken, price, amount, amount, true, timestamp));
  }

  function pop() public returns (uint64 id, address owner, address baseToken, address tradeToken, uint price, uint amount, uint64 timestamp){
    OrderNode.Node memory n = data.pop();
    id = n.id;
    owner = n.owner;
    tradeToken = n.tradeToken;
    baseToken = n.baseToken;
    price = n.price;
    amount = n.amount;
    timestamp = n.timestamp;
  }

  function removeById(uint64 id) public {
    data.removeById(id);
  }

  function updatePriceById(uint64 id, uint newPrice) public {
    data.updatePriceById(id, newPrice);
  }

  function updateAmountById(uint64 id, uint newAmount) public {
    data.updateAmountById(id, newAmount);
  }

  function peak() public view returns (uint64 id, address owner, address baseToken, address tradeToken, uint price, uint amount, uint64 timestamp) {
    OrderNode.Node memory n = data.peak();
    id = n.id;
    owner = n.owner;
    tradeToken = n.tradeToken;
    baseToken = n.baseToken;
    price = n.price;
    amount = n.amount;
    timestamp = n.timestamp;
  }

  function getById(uint64 _id) public view returns (uint64 id, address owner, address baseToken, address tradeToken, uint price, uint amount, uint64 timestamp) {
    OrderNode.Node memory n = data.getById(_id);
    id = n.id;
    owner = n.owner;
    tradeToken = n.tradeToken;
    baseToken = n.baseToken;
    price = n.price;
    amount = n.amount;
    timestamp = n.timestamp;
  }

  function getByIndex(uint64 i) public view returns (uint64 id, address owner, address baseToken, address tradeToken, uint price, uint amount, uint64 timestamp) {
    OrderNode.Node memory n = data.getByIndex(i);
    id = n.id;
    owner = n.owner;
    tradeToken = n.tradeToken;
    baseToken = n.baseToken;
    price = n.price;
    amount = n.amount;
    timestamp = n.timestamp;
  }

  function getOrders(uint16 limit) public view returns (uint64[], address[], uint[], uint[], uint[], uint64[]) {
    return data.getOrders(limit);
  }

  function getAggregatedOrders(uint16 limit) public view returns (uint[], uint[]) {
    return data.getAggregatedOrders(limit);
  }

  function size() public view returns (uint){
    return data.size();
  }
}
