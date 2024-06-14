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

const { utils, getCurveFromName, Scalar } = require("ffjavascript");
const { unstringifyBigInts } = utils;
const { toRprLE } = Scalar;

async function convertProof(proofJSON) {
  const proof = unstringifyBigInts(proofJSON);
  const curve = await getCurveFromName(proof.curve);
  return {
    a: pointToHexLE(curve.G1, proof.pi_a),
    b: pointToHexLE(curve.G2, proof.pi_b),
    c: pointToHexLE(curve.G1, proof.pi_c),
  };
}

async function convertVk(vkJSON) {
  const vk = unstringifyBigInts(vkJSON);
  const curve = await getCurveFromName(vk.curve);
  return {
    curve: getCurveName(curve),
    alphaG1: pointToHexLE(curve.G1, vk.vk_alpha_1),
    betaG2: pointToHexLE(curve.G2, vk.vk_beta_2),
    gammaG2: pointToHexLE(curve.G2, vk.vk_gamma_2),
    deltaG2: pointToHexLE(curve.G2, vk.vk_delta_2),
    gammaAbcG1: vk.IC.map((point) => pointToHexLE(curve.G1, point)),
  };
}

async function convertPub(pubJSON, snarkJSCurveName) {
  const pub = unstringifyBigInts(pubJSON);
  const curve = await getCurveFromName(snarkJSCurveName);
  return pub.map((scalar) => scalarToHexLE(curve.Fr, scalar));
}

function getCurveName(curve) {
  let curveName;
  switch (curve.name) {
    case "bn128":
      curveName = "Bn254";
      break;
    case "bls12381":
      curveName = "Bls12_381";
      break;
    default:
      throw new Error(`Curve ${curve.name} is not supported`);
  }
  return curveName;
}

const pointToHexLE = (curveType, point) => {
  const p = curveType.fromObject(point);
  const pUncompressed = curveType.toUncompressed(p);
  const x = pUncompressed.slice(0, curveType.F.n8).reverse();
  const y = pUncompressed.slice(curveType.F.n8).reverse();
  return "0x" + toHexString(x) + toHexString(y);
};

function scalarToHexLE(scalarType, scalar) {
  const buff = new Uint8Array(scalarType.n8);
  toRprLE(buff, 0, scalar, buff.byteLength);
  return "0x" + toHexString(buff);
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

module.exports = { convertProof, convertVk, convertPub };
