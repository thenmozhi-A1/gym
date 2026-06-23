import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import axiosInstance from './axiosInstance';

// REGISTRATION — call this from user profile/settings page (authenticated)
export async function enrollFingerprint(userId, username) {
  // Step 1: get challenge from backend
  const { data: options } = await axiosInstance.post(`/v1/webauthn/register/begin`, {
    userId, username
  });

  // Step 2: browser prompts fingerprint — private key never leaves device
  let credential;
  try {
    credential = await startRegistration(options);
  } catch (err) {
    if (err.name === 'NotAllowedError') throw new Error('Fingerprint scan cancelled or not allowed');
    if (err.name === 'InvalidStateError') throw new Error('This device is already registered');
    throw err;
  }

  // Step 3: send signed credential to backend for verification + storage
  const { data: result } = await axiosInstance.post(`/v1/webauthn/register/complete`, {
    userId, credential
  });
  return result; // { success, deviceType, message }
}

// AUTHENTICATION — call this from the kiosk attendance page (unauthenticated)
export async function verifyFingerprint(email) {
  // Step 1: get challenge
  const { data: options } = await axiosInstance.post(`/v1/webauthn/auth/begin`, { email });

  // Step 2: device prompts fingerprint scan
  let assertion;
  try {
    assertion = await startAuthentication(options);
  } catch (err) {
    if (err.name === 'NotAllowedError') throw new Error('Fingerprint scan cancelled');
    if (err.name === 'NotFoundError') throw new Error('No fingerprint registered on this device');
    throw err;
  }

  // Step 3: verify on server + log attendance
  const { data: result } = await axiosInstance.post(`/v1/webauthn/auth/complete`, {
    email, assertion
  });
  return result; // { success, action, userName, role, timestamp }
}

// GET CREDENTIALS
export async function getCredentials(userId) {
  const { data } = await axiosInstance.get(`/v1/webauthn/credentials/${userId}`);
  return data;
}

// DELETE CREDENTIAL
export async function deleteCredential(credentialId) {
  const { data } = await axiosInstance.delete(`/v1/webauthn/credentials/${credentialId}`);
  return data;
}
