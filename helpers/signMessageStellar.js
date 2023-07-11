const nacl = require('tweetnacl');
const StellarSdk = require('stellar-sdk');

// Stellar private keys are typically encoded in a specific format called "secret seed" and are 32 bytes in size.

// Public Key	GC6QCVQFF7MOWXWZSW6FTPXJTGEWTD4N2TDTYFKPZHXBJSDBHZOBFRI5
// Secret Key	SDEMLYC54A45JXWVW5R7LXYCG272TXCMN64ZDIZNKZHVRJRZYYSFSTTY

// Stellar private key
const privateKey = 'SDEMLYC54A45JXWVW5R7LXYCG272TXCMN64ZDIZNKZHVRJRZYYSFSTTY'; // Replace with your actual private key

// stellar keypair
const keypair = StellarSdk.Keypair.fromSecret(privateKey);
console.log("🚀 ~ file: signMessageStellar.js:14 ~ keypair:", keypair.secret());

// Convert private key to Uint8Array
const privateKeyBytes = Buffer.from(keypair.secret(), 'base64');
console.log("🚀 ~ file: signMessageStellar.js:14 ~ privateKeyBytes:", privateKeyBytes);
console.log("🚀 ~ file: signMessageStellar.js:14 ~ privateKeyBytes.length:", privateKeyBytes.length);

// Convert private key to Uint8Array
const privateKey1Bytes = Buffer.from(privateKey, 'base64');
console.log("🚀 ~ file: signMessageStellar.js:23 ~ privateKey1Bytes:", privateKey1Bytes);
console.log("🚀 ~ file: signMessageStellar.js:23 ~ privateKey1Bytes.length:", privateKey1Bytes.length);

// Message to sign
const message = 'hello world';

// Sign the message
const signature = keypair.sign(Buffer.from(message));
console.log("🚀 ~ file: signMessageStellar.js:18 ~ signature:", signature);
console.log("🚀 ~ file: signMessageStellar.js:18 ~ signature.length:", signature.length);
console.log("🚀 ~ file: signMessageStellar.js:18 ~ typeof(signature):", typeof (signature));

// // Sign the message using nacl
// const signatureBytes = nacl.sign.detached(Buffer.from(message), privateKeyBytes);

// // Convert signature to base64 string
// const signature = Buffer.from(signatureBytes).toString('base64');

console.log('\nSignature toString:', signature.toString('base64'));

console.log('Signed Message:', message);
console.log('Signature:', signature);


/* // references for debugging
const crypto_sign_SECRETKEYBYTES = 64;
const crypto_sign_BYTES = 64;

nacl.sign = function (message, secretKey) {
  // Check the input array types
  checkArrayTypes(message, secretKey);
  
  // Validate the secret key size
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('Invalid secret key size');
  
  // Create an array to store the signed message
  const signedMessage = new Uint8Array(crypto_sign_BYTES + message.length);
  
  // Call the signMessage function to sign the message
  signMessage(signedMessage, message, message.length, secretKey);
  
  // Return the signed message
  return signedMessage;
};


function signMessage(signedMsg, message, msgLength, secretKey) {
  // Initialize variables and arrays
  const secretKeyBytes = new Uint8Array(64);
  const hashedMsg = new Uint8Array(64);
  const reducedHash = new Uint8Array(64);
  const tempArray = new Float64Array(64);
  const point = [gf(), gf(), gf(), gf()];

  // Hash the secret key and perform bit manipulations
  crypto_hash(secretKeyBytes, secretKey, 32);
  secretKeyBytes[0] &= 248;
  secretKeyBytes[31] &= 127;
  secretKeyBytes[31] |= 64;

  // Calculate the length of the signed message
  const signedMsgLength = msgLength + 64;
  
  // Copy the message and secret key into the signed message array
  for (let i = 0; i < msgLength; i++) {
    signedMsg[64 + i] = message[i];
  }
  for (let i = 0; i < 32; i++) {
    signedMsg[32 + i] = secretKeyBytes[32 + i];
  }

  // Hash the partial message and reduce the hash
  crypto_hash(hashedMsg, signedMsg.subarray(32), msgLength + 32);
  reduce(reducedHash);
  
  // Calculate a point on the Ed25519 curve using the reduced hash
  scalarbase(point, reducedHash);
  
  // Pack the point into the signed message array
  pack(signedMsg, point);

  // Copy the remaining part of the secret key into the signed message array
  for (let i = 32; i < 64; i++) {
    signedMsg[i] = secretKey[i];
  }
  
  // Hash the complete signed message
  crypto_hash(hashedMsg, signedMsg, msgLength + 64);
  reduce(hashedMsg);

  // Perform scalar multiplication and modular arithmetic
  for (let i = 0; i < 64; i++) {
    tempArray[i] = 0;
  }
  for (let i = 0; i < 32; i++) {
    tempArray[i] = reducedHash[i];
  }
  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 32; j++) {
      tempArray[i + j] += hashedMsg[i] * secretKeyBytes[j];
    }
  }

  // Reduce the values in the temporary array modulo the Ed25519 prime order
  modL(signedMsg.subarray(32), tempArray);
  
  // Return the length of the signed message
  return signedMsgLength;
}

// Inside the signMessage function, the following steps are performed:

// Initialization of variables and arrays to store intermediate values.
// Hashing the secret key using the crypto_hash function and performing bit manipulations to ensure the key meets the required format.
// Calculating the length of the signed message.
// Copying the message and secret key into the signed message array.
// Hashing the partial message (excluding the secret key) and reducing the hash value.
// Calculating a point on the Ed25519 curve based on the reduced hash.
// Packing the point into the signed message array.
// Copying the remaining part of the secret key into the signed message array.
// Hashing the complete signed message.
// Reducing the hash value.
// Performing scalar multiplication and modular arithmetic to obtain the final signature.
// Storing the signature in the signed message array starting from index 32.
// Returning the length of the signed message.
// Overall, this code snippet implements the signing process according to the Ed25519 algorithm using low-level cryptographic operations and array manipulations.

*/
