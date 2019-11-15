import { JSO } from "jso";
import pkceChallenge from "pkce-challenge";

const { code_verifier, code_challenge } = pkceChallenge();

// Configure client
const client = new JSO({
  providerID: "hc-directory",
  client_id: process.env.DIRECTORY_OAUTH_CLIENT_ID,
  client_secret: process.env.DIRECTORY_OAUTH_CLIENT_SECRET,
  redirect_uri: process.env.DIRECTORY_REDIRECT_URI,
  authorization: "https://directory.heidelberg.cloud/oauth/authorize",
  token: "https://directory.heidelberg.cloud/oauth/access_token",
  debug: true,
  request: {
    code_challenge_method: "S256",
    code_challenge
  }
  // TODO: scopes: { request: [] }
});

// On the page that the user is sent back to after authorization
client.callback();

const login = document.getElementById("login");

login.addEventListener("click", () => {
  client
    .getToken({
      response_type: "application/json",
      request: {
        code_verifier
      }
    })
    .then(token => {
      console.log("Bearer token: ", token);
      // TODO fetch https://directory.heidelberg.cloud/api/v1/person
    });
});
