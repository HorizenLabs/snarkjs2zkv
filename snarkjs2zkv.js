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

const { Command, Option } = require("commander");
const fs = require("fs");
const { convertProof, convertVk, convertPub } = require("./convert.js");

const program = new Command();

program
  .name("snarkjs2zkv")
  .description(
    "convert Groth16 artifacts generated with snarkJS to the format accepted by zkVerify pallet-settlement-groth16"
  )
  .version("0.1.0");

program
  .command("convert-proof")
  .description("convert a Groth16 proof")
  .argument("<proof>", "JSON file containing the proof in snarkJS format")
  .option("-o, --out <file>", "output file (print to stdout if not specified")
  .action(async (filename, options) => {
    const proofIn = JSON.parse(fs.readFileSync(filename, "utf8"));
    const proofOut = await convertProof(proofIn);
    const proofOutJSON = JSON.stringify(proofOut, null, 2);
    if (options.out) {
      fs.writeFileSync(options.out, proofOutJSON);
    } else {
      console.log(proofOutJSON);
    }
  });

program
  .command("convert-vk")
  .description("convert a Groth16 verification key")
  .argument(
    "<vk>",
    "JSON file containing the verification key in snarkJS format"
  )
  .option("-o, --out <file>", "output file (print to stdout if not specified")
  .action(async (filename, options) => {
    const vkIn = JSON.parse(fs.readFileSync(filename, "utf8"));
    const vkOut = await convertVk(vkIn);
    const vkOutJSON = JSON.stringify(vkOut, null, 2);
    if (options.out) {
      fs.writeFileSync(options.out, vkOutJSON);
    } else {
      console.log(vkOutJSON);
    }
  });

program
  .command("convert-public")
  .description("convert Groth16 public inputs")
  .argument(
    "<public>",
    "JSON file containing the public inputs in snarkJS format"
  )
  .addOption(
    new Option("-c, --curve <curve>", "curve of the SNARK")
      .makeOptionMandatory()
      .choices(["bn128", "bls12381"])
  )
  .option("-o, --out <file>", "output file (print to stdout if not specified)")
  .action(async (filename, options) => {
    const pubIn = JSON.parse(fs.readFileSync(filename, "utf8"));
    const pubOut = await convertPub(pubIn, options.curve);
    const pubOutJSON = JSON.stringify(pubOut, null, 2);
    if (options.out) {
      fs.writeFileSync(options.out, pubOutJSON);
    } else {
      console.log(pubOutJSON);
    }
  });

program
  .parseAsync(process.argv)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
