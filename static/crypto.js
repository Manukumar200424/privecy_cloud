// Client-side crypto helpers using Web Crypto API
// Functions:
// - deriveKeyFromPassword(password, salt_b64) -> CryptoKey (AES-GCM 256)
// - encryptFileWithKey(file, key) -> {iv: ArrayBuffer, ciphertext: ArrayBuffer}
// - decryptArrayBuffer(ciphertext, key, iv) -> plaintext ArrayBuffer
// - utility base64 <-> ArrayBuffer

async function deriveKeyFromPassword(password, salt_b64) {
  const salt = base64ToArrayBuffer(salt_b64);
  const enc = new TextEncoder();
  const pwUtf8 = enc.encode(password);
  const baseKey = await crypto.subtle.importKey(
    "raw", pwUtf8, {name: "PBKDF2"}, false, ["deriveKey"]
  );
  // PBKDF2 params (demo): 200k iterations
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 200000,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  return key;
}

async function encryptFileWithKey(file, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV recommended for GCM
  const arrayBuffer = await file.arrayBuffer();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    arrayBuffer
  );
  return { iv: iv.buffer, ciphertext };
}

async function decryptArrayBuffer(ciphertext, key, iv) {
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    ciphertext
  );
  return plaintext;
}

// Utilities
function arrayBufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToArrayBuffer(b64) {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}