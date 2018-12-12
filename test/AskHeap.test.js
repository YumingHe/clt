const TestAskHeap = artifacts.require("TestAskHeap")

contract('AskHeap',  async(accounts) => {
  let heap;
  const EMPTY_NODE = {id: 0, owner: 0, baseToken: 0, tradeToken: 0, price: 0, amount: 0, timestamp: 0}

  beforeEach(async () => {
    heap = await TestAskHeap.new()
  })

  describe("insert", async() => {
    it("should init heap with empty node at index 0", async() => {
      const nodes = [
        {id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 1, amount: 0, timestamp: 0}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)

      const result = await heap.getByIndex.call(0)
      assertNodeEqual(result, EMPTY_NODE)
    })

    it("should insert keys in min-heap-like fashion", async () => {
      const nodes = [
        {id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 100, amount: 0, timestamp: 0},
        {id: 2, owner: accounts[3], baseToken: accounts[4], tradeToken: accounts[5], price: 10, amount: 0, timestamp: 0},
        {id: 3, owner: accounts[6], baseToken: accounts[7], tradeToken: accounts[8], price: 1, amount: 0, timestamp: 0}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      const root = await heap.getByIndex.call(1)
      assertNodeEqual(root, nodes[2])

      const leftChild = await heap.getByIndex.call(2)
      assertNodeEqual(leftChild, nodes[0])

      const rightChild = await heap.getByIndex.call(3)
      assertNodeEqual(rightChild, nodes[1])
    })

    it("should handle equal price values", async () => {
      const nodes = [
        {id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 2, amount: 0, timestamp: 0},
        {id: 2, owner: accounts[3], baseToken: accounts[4], tradeToken: accounts[5], price: 1, amount: 0, timestamp: 0},
        {id: 3, owner: accounts[6], baseToken: accounts[7], tradeToken: accounts[8], price: 1, amount: 0, timestamp: 0}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      const root = await heap.getByIndex.call(1)
      assertNodeEqual(root, nodes[1])

      const leftChild = await heap.getByIndex.call(2)
      assertNodeEqual(leftChild, nodes[0])

      const rightChild = await heap.getByIndex.call(3)
      assertNodeEqual(rightChild, nodes[2])
    })
    
    it("should order nodes by id (FIFO) when price values are equal", async () => {
      const nodes = [
        {id: 3, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 1, amount: 0, timestamp: 0},
        {id: 2, owner: accounts[3], baseToken: accounts[4], tradeToken: accounts[5], price: 1, amount: 0, timestamp: 0},
        {id: 1, owner: accounts[6], baseToken: accounts[7], tradeToken: accounts[8], price: 1, amount: 0, timestamp: 0}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      const root = await heap.getByIndex.call(1)
      assertNodeEqual(root, nodes[2])

      const leftChild = await heap.getByIndex.call(2)
      assertNodeEqual(leftChild, nodes[0])

      const rightChild = await heap.getByIndex.call(3)
      assertNodeEqual(rightChild, nodes[1])
    })
  })

  describe("pop", async() => {
    it("should return empty node if heap is empty", async() => {
      const result = await heap.pop.call()
      assertNodeEqual(result, EMPTY_NODE)
    })

    it("should remove node if heap has single node", async() => {
      const nodes = [{id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 1, amount: 2, timestamp: 3}]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)

      const sizeAfterAdd = await heap.size.call()
      assert.equal(sizeAfterAdd.toNumber(), 1)

      const result = await heap.pop.call()
      assertNodeEqual(result, nodes[0])
      await heap.pop()

      const sizeAfterPop = await heap.size.call()
      assert.equal(sizeAfterPop.toNumber(), 0)
    })

    it("should remove min key nodes from heap", async() => {
      const nodes = [
        {id: 1, owner: accounts[1], baseToken: accounts[1], tradeToken: accounts[1], price: 100, amount: 0, timestamp: 0},
        {id: 2, owner: accounts[1], baseToken: accounts[1], tradeToken: accounts[1], price: 10, amount: 0, timestamp: 0},
        {id: 3, owner: accounts[1], baseToken: accounts[1], tradeToken: accounts[1], price: 1, amount: 0, timestamp: 0}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      const sizeAfterAdd = await heap.size.call()
      assert.equal(sizeAfterAdd.toNumber(), 3)

      let result = await heap.pop.call()
      assertNodeEqual(result, nodes[2])
      await heap.pop()

      result = await heap.pop.call()
      assertNodeEqual(result, nodes[1])
      await heap.pop()

      result = await heap.pop.call()
      assertNodeEqual(result, nodes[0])
      await heap.pop()

      const sizeAfterPop = await heap.size.call()
      assert.equal(sizeAfterPop.toNumber(), 0)
    })
    
    it("should remove min key nodes from heap with equal prices", async() => {
      const nodes = [
        {id: 1, owner: accounts[1], baseToken: accounts[1], tradeToken: accounts[1], price: 1, amount: 0, timestamp: 0},
        {id: 2, owner: accounts[1], baseToken: accounts[1], tradeToken: accounts[1], price: 1, amount: 0, timestamp: 0},
        {id: 3, owner: accounts[1], baseToken: accounts[1], tradeToken: accounts[1], price: 1, amount: 0, timestamp: 0},
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      let result = await heap.pop.call()
      assertNodeEqual(result, nodes[0])
      await heap.pop()

      result = await heap.pop.call()
      assertNodeEqual(result, nodes[1])
      await heap.pop()

      result = await heap.pop.call()
      assertNodeEqual(result, nodes[2])
      await heap.pop()
    })
  })

  describe("update", async() => {
    it("should maintain min heap order after price decrease update", async() => {
      const nodes = [
        {id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 100, amount: 0, timestamp: 0},
        {id: 2, owner: accounts[3], baseToken: accounts[4], tradeToken: accounts[5], price: 10, amount: 0, timestamp: 0},
        {id: 3, owner: accounts[6], baseToken: accounts[7], tradeToken: accounts[8], price: 1, amount: 0, timestamp: 0}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      nodes[0].price = 0
      await heap.updatePriceById(1, nodes[0].price)

      const root = await heap.getByIndex.call(1)
      assertNodeEqual(root, nodes[0])

      const leftChild = await heap.getByIndex.call(2)
      assertNodeEqual(leftChild, nodes[2])

      const rightChild = await heap.getByIndex.call(3)
      assertNodeEqual(rightChild, nodes[1])
    })

    it("should maintain min heap order after price increase update", async() => {
      const nodes = [
        {id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 100, amount: 0, timestamp: 0},
        {id: 2, owner: accounts[3], baseToken: accounts[4], tradeToken: accounts[5], price: 10, amount: 0, timestamp: 0},
        {id: 3, owner: accounts[6], baseToken: accounts[7], tradeToken: accounts[8], price: 1, amount: 0, timestamp: 0}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      nodes[2].price = 50
      await heap.updatePriceById(3, nodes[2].price)

      const root = await heap.getByIndex.call(1)
      assertNodeEqual(root, nodes[1])

      const leftChild = await heap.getByIndex.call(2)
      assertNodeEqual(leftChild, nodes[0])

      const rightChild = await heap.getByIndex.call(3)
      assertNodeEqual(rightChild, nodes[2])
    })

    it("should do nothing is newPrice is same", async() => {
      const nodes = [
        {id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 100, amount: 0, timestamp: 0},
        {id: 2, owner: accounts[3], baseToken: accounts[4], tradeToken: accounts[5], price: 10, amount: 0, timestamp: 0},
        {id: 3, owner: accounts[6], baseToken: accounts[7], tradeToken: accounts[8], price: 1, amount: 0, timestamp: 0}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      await heap.updatePriceById(1, nodes[0].price)
      await heap.updatePriceById(2, nodes[1].price)
      await heap.updatePriceById(3, nodes[2].price)

      const root = await heap.getByIndex.call(1)
      assertNodeEqual(root, nodes[2])

      const leftChild = await heap.getByIndex.call(2)
      assertNodeEqual(leftChild, nodes[0])

      const rightChild = await heap.getByIndex.call(3)
      assertNodeEqual(rightChild, nodes[1])
    })
    
    it("should update amount", async() => {
      const nodes = [
        {id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 1, amount: 0, timestamp: 0}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      
      const newAmount = 10
      await heap.updateAmountById(1, newAmount)

      const updatedNode = await heap.getById.call(1)
      assert.equal(updatedNode[5], newAmount)
    })
  })

  describe("removeById", async() => {
    it("should extract node by unique id", async () => {
      const nodes = [
        {id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 1, amount: 0, timestamp: 0},
        {id: 2, owner: accounts[3], baseToken: accounts[4], tradeToken: accounts[5], price: 10, amount: 0, timestamp: 0},
        {id: 3, owner: accounts[6], baseToken: accounts[7], tradeToken: accounts[8], price: 100, amount: 0, timestamp: 0}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      await heap.removeById(2)

      const result = await heap.getById.call(2)
      assertNodeEqual(result, EMPTY_NODE)
    })
  })

  describe("peak", async() => {
    it("should return root of heap", async () => {
      const nodes = [
        {id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 100, amount: 2, timestamp: 3},
        {id: 2, owner: accounts[3], baseToken: accounts[4], tradeToken: accounts[5], price: 10, amount: 20, timestamp: 30},
        {id: 3, owner: accounts[6], baseToken: accounts[7], tradeToken: accounts[8], price: 1, amount: 200, timestamp: 300}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      const result = await heap.peak.call()
      assertNodeEqual(result, nodes[2])
    })
  })

  describe("getById", async() => {
    it("should find node by unique id", async () => {
      const nodes = [
        {id: 1, owner: accounts[0], baseToken: accounts[1], tradeToken: accounts[2], price: 1, amount: 2, timestamp: 3},
        {id: 2, owner: accounts[3], baseToken: accounts[4], tradeToken: accounts[5], price: 10, amount: 20, timestamp: 30},
        {id: 3, owner: accounts[6], baseToken: accounts[7], tradeToken: accounts[8], price: 100, amount: 200, timestamp: 300}
      ]

      await heap.add(nodes[0].id, nodes[0].owner, nodes[0].baseToken, nodes[0].tradeToken, nodes[0].price, nodes[0].amount, nodes[0].timestamp)
      await heap.add(nodes[1].id, nodes[1].owner, nodes[1].baseToken, nodes[1].tradeToken, nodes[1].price, nodes[1].amount, nodes[1].timestamp)
      await heap.add(nodes[2].id, nodes[2].owner, nodes[2].baseToken, nodes[2].tradeToken, nodes[2].price, nodes[2].amount, nodes[2].timestamp)

      const result = await heap.getById.call(2)
      assertNodeEqual(result, nodes[1])
    })
  })

  function assertNodeEqual(actualNode, expectedNode) {
    assert.equal(actualNode[0].toNumber(), expectedNode.id)
    assert.equal(actualNode[1], expectedNode.owner)
    assert.equal(actualNode[2], expectedNode.baseToken)
    assert.equal(actualNode[3], expectedNode.tradeToken)
    assert.equal(actualNode[4].toNumber(), expectedNode.price)
    assert.equal(actualNode[5].toNumber(), expectedNode.amount)
    assert.equal(actualNode[6].toNumber(), expectedNode.timestamp)
  }
})
