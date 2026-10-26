/**
 * Example Template for Secret Tokens & Credentials Configuration
 *
 * INSTRUCTIONS:
 * 1. Copy this file and rename it to `tokens.ts` in the same directory:
 *    src/environments/tokens.ts
 * 2. Replace the placeholder values below with your actual API keys and tokens.
 * 3. Never commit `tokens.ts` to Git! It is already listed in `.gitignore`.
 */

export const TOKENS = {
  // Main API Headers
  APIKEY: 'YOUR_APIKEY_HERE',
  SUPPORTKEY: 'YOUR_SUPPORTKEY_HERE',
  MAIN_TOKEN: 'YOUR_MAIN_TOKEN_HERE',

  // PAN Verification Token
  PAN_VERIFY_TOKEN: 'YOUR_PAN_VERIFY_TOKEN_HERE',

  // Voter ID, Driving License & Passport Verification Token (Surepass Sandbox)
  VOTER_ID_LICENSE_TOKEN: 'YOUR_VOTER_ID_LICENSE_TOKEN_HERE',

  // Aadhaar Verification Token (OVD Service)
  AADHAAR_TOKEN: 'YOUR_AADHAAR_TOKEN_HERE',

  // Aadhaar Token Generation Credentials
  AADHAAR_AUTH: {
    userName: 'YOUR_AADHAAR_USERNAME',
    password: 'YOUR_AADHAAR_PASSWORD',
  },

  // RSA Encryption Keys
  RSA_KEYS: {
    public_key: `-----BEGIN PUBLIC KEY-----
YOUR_PUBLIC_KEY_PEM_HERE
-----END PUBLIC KEY-----`,

    private_key: `-----BEGIN RSA PRIVATE KEY-----
YOUR_RSA_PRIVATE_KEY_PEM_HERE
-----END RSA PRIVATE KEY-----`,

    server_publickey: `-----BEGIN PUBLIC KEY-----
YOUR_SERVER_PUBLIC_KEY_PEM_HERE
-----END PUBLIC KEY-----`,
  },
};
