const { convertProof, convertVk, convertPub } = require(".../../../convert");
const assert = require("assert");
const { testData } = require("./test_data");
const { proof: proofData, vk: vkData, pub: pubData } = testData;

describe("Convert", function () {
  describe("Proof", function () {
    describe("BN128", function () {
      it("should succeed", async function () {
        const proof = await convertProof(proofData.bn128.in);
        assert.equal(
          JSON.stringify(proof),
          JSON.stringify(proofData.bn128.out)
        );
      });
    });

    describe("BLS12-381", function () {
      it("should succeed", async function () {
        const proof = await convertProof(proofData.bls12381.in);
        assert.equal(
          JSON.stringify(proof),
          JSON.stringify(proofData.bls12381.out)
        );
      });
    });
  });

  describe("Vk", function () {
    describe("BN128", function () {
      it("should succeed", async function () {
        const vk = await convertVk(vkData.bn128.in);
        assert.equal(JSON.stringify(vk), JSON.stringify(vkData.bn128.out));
      });
    });

    describe("BLS12-381", function () {
      it("should succeed", async function () {
        const vk = await convertVk(vkData.bls12381.in);
        assert.equal(JSON.stringify(vk), JSON.stringify(vkData.bls12381.out));
      });
    });
  });

  describe("Pub", function () {
    describe("BN128", function () {
      it("should succeed", async function () {
        const pub = await convertPub(pubData.bn128.in, "bn128");
        assert.equal(JSON.stringify(pub), JSON.stringify(pubData.bn128.out));
      });
    });

    describe("BLS12-381", function () {
      it("should succeed", async function () {
        const pub = await convertPub(pubData.bls12381.in, "bls12381");
        assert.equal(JSON.stringify(pub), JSON.stringify(pubData.bls12381.out));
      });
    });
  });
});
