// Copyright 2024, Horizen Labs, Inc.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

const {
  convertProof,
  convertVk,
  convertPub,
  pointToHexLE,
} = require(".../../../convert");
const assert = require("assert");
const { testData } = require("./test_data");
const { getCurveFromName } = require("ffjavascript");

const {
  proof: proofData,
  vk: vkData,
  pub: pubData,
  arkworksG1Times42,
  arkworksG2Times42,
} = testData;

describe("Serialize", function () {
  describe("G1 * 42", function () {
    describe("BN128", async function () {
      it("should give the same result as arkworks", async function () {
        const curve = await getCurveFromName("bn128");
        const generator = curve.G1.gAffine;
        const scalar = 42;
        const point = curve.G1.timesScalar(generator, scalar);
        assert.equal(
          pointToHexLE(curve.G1, curve.G1.toObject(point), "BE"),
          arkworksG1Times42.bn128
        );
      });
    });
  });

  describe("G1 * 42", function () {
    describe("BLS12-381", async function () {
      it("should give the same result as arkworks", async function () {
        const curve = await getCurveFromName("bls12381");
        const generator = curve.G1.gAffine;
        const scalar = 42;
        const point = curve.G1.timesScalar(generator, scalar);
        assert.equal(
          pointToHexLE(curve.G1, curve.G1.toObject(point), "LE"),
          arkworksG1Times42.bls12381
        );
      });
    });
  });

  describe("G2 * 42", function () {
    describe("BN128", async function () {
      it("should give the same result as arkworks", async function () {
        const curve = await getCurveFromName("bn128");
        const generator = curve.G2.gAffine;
        const scalar = 42;
        const point = curve.G2.timesScalar(generator, scalar);
        assert.equal(
          pointToHexLE(curve.G2, curve.G2.toObject(point), "BE"),
          arkworksG2Times42.bn128
        );
      });
    });
  });

  describe("G2 * 42", function () {
    describe("BLS12-381", async function () {
      it("should give the same result as arkworks", async function () {
        const curve = await getCurveFromName("bls12381");
        const generator = curve.G2.gAffine;
        const scalar = 42;
        const point = curve.G2.timesScalar(generator, scalar);
        assert.equal(
          pointToHexLE(curve.G2, curve.G2.toObject(point), "LE"),
          arkworksG2Times42.bls12381
        );
      });
    });
  });
});

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
