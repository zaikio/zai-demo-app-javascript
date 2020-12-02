import pkceChallenge from "pkce-challenge";
import axios from "axios";

export function authorize() {
  // Initialize SSO with Zaikio
  const { code_verifier, code_challenge } = pkceChallenge();
  // Store code_verifier
  window.sessionStorage.setItem("code_verifier", code_verifier);
  // Open the page in a new window, then redirect back to the same page.
  window.location.href =
    process.env.DIRECTORY_HOST +
    "/oauth/authorize?client_id=" +
    process.env.DIRECTORY_OAUTH_CLIENT_ID +
    "&redirect_uri=" +
    process.env.DIRECTORY_REDIRECT_URI +
    "&code_challenge_method=S256&code_challenge=" +
    code_challenge +
    "&scope=directory.person.r";
}

export async function createAccessToken(code) {
  // Fetch code verifier for PKCE that was stored before
  const code_verifier = window.sessionStorage.getItem("code_verifier");
  window.sessionStorage.removeItem("code_verifier");

  // Use code to create access token
  return (
    await axios.post(process.env.DIRECTORY_HOST + "/oauth/access_token.json", {
      client_id: process.env.DIRECTORY_OAUTH_CLIENT_ID,
      code_verifier,
      code,
    })
  ).data;
}

export function getAccessToken() {
  if (window.sessionStorage.getItem("directory_authentication")) {
    return JSON.parse(window.sessionStorage.getItem("directory_authentication"))
      .access_token;
  }
}

export function isLoggedIn() {
  return !!window.sessionStorage.getItem("directory_authentication");
}

export function login(data) {
  window.sessionStorage.setItem(
    "directory_authentication",
    JSON.stringify(data)
  );
}

export function logout() {
  window.sessionStorage.removeItem("directory_authentication");
}
