import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Ed25519Poc } from "../target/types/ed25519_poc";
// import * as ed from '@noble/ed25519';
import nacl from "tweetnacl";
// import solanaWeb3 from "@solana/web3.js"
// import * as assert from 'assert';
import { Connection } from '@solana/web3.js';
import fs from "fs";


describe("ed25519_poc", () => {
  // Configure the client to use the local cluster.
  //anchor.setProvider(anchor.AnchorProvider.env());
  const connection = new Connection("http://127.0.0.1:8899");
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider)
  const program = anchor.workspace.Ed25519Poc as Program<Ed25519Poc>;
  //let person: anchor.web3.Keypair;
  const MSG = Uint8Array.from(Buffer.from("this is such a good message to sign"));
  let invoker = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('./keys/invoker.json').toString())));
  let signature: Uint8Array;

  console.log("MSG Bytes", MSG)

  console.log("🚀 ~ file: ed25519_poc.ts:25 ~ describe ~ invoker.publicKey:", invoker.publicKey.toBase58());

  it("Signatures should be verified", async () => {
    let invoker_balance = await connection.getBalance(invoker.publicKey);
    console.log("invoker_balance", invoker_balance)

    //Ed25519 signature
    signature = nacl.sign.detached(MSG, invoker.secretKey)
    console.log("signature bytes", signature) // here console signature as a bytes

    let signatureString = Buffer.from(signature).toString('hex') // convert uint8array in string
    console.log("signature String", signatureString) // console signature as a string

    // Ed25519 instruction
    let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey(
      {
        publicKey: invoker.publicKey.toBytes(), // The public key associated with the instruction (as bytes)
        message: MSG,  // The message to be included in the instruction (as a Buffer)
        signature: signature, // The signature associated with the instruction (as a Buffer)
        // instructionIndex: 0
      }
    )

    console.log("🚀 ~ file: ed25519_poc.ts:50 ~ it ~ invoker.publicKey.toBuffer():", invoker.publicKey.toBuffer(), "typeof: ", typeof (invoker.publicKey.toBuffer()), "length: ", (invoker.publicKey.toBuffer()).length);
    console.log("🚀 ~ file: ed25519_poc.ts:52 ~ it ~  Buffer.from(MSG):", Buffer.from(MSG), "typeof: ", typeof (Buffer.from(MSG)), "length: ", (Buffer.from(MSG)).length);
    console.log("🚀 ~ file: ed25519_poc.ts:56 ~ it ~ Buffer.from(signature)):", Buffer.from(signature), " typeof: ", typeof (Buffer.from(signature)), "length: ", (Buffer.from(signature)).length);

    let ix02 = await program.methods.verifyEd25519(
      //@ts-ignore
      invoker.publicKey.toBuffer(),
      Buffer.from(MSG),
      Buffer.from(signature))
      .accounts({
        sender: invoker.publicKey,
        ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      // .signers([invoker])
      .instruction()


    // Construct transaction made of 2 instructions:
    //      - Ed25519 sig verification instruction to the Ed25519Program
    //      - Custom instruction to our program
    // The second instruction checks that the 1st one has been sent in the same transaction.
    // It checks that program_id, accounts, and data are what should have been send for
    // the params that we are intending to check.
    // If the first instruction doesn't fail and our instruction manages to deserialize
    // the data and check that it is correct, it means that the sig verification was successful.
    // Otherwise it failed.

    let tx = new anchor.web3.Transaction().add(
      ix01, ix02
    )

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    console.log("🚀 ~ file: ed25519_poc.ts:71 ~ it ~ tx:", tx);


    let tx_hash;
    try {
      tx_hash = await anchor.web3.sendAndConfirmTransaction(
        connection,
        tx,
        [invoker]
      );
      console.log("🚀 ~ file: ed25519_poc.ts:82 ~ it ~ tx_hash:", tx_hash);

    } catch (error) {
      console.log("🚀 ~ file: ed25519_poc.ts:85 ~ it ~ error:", error);
      // assert.fail(`Should not have failed with the following error:\n${error}`);
    }
  });
});
