import pkceChallenge from "pkce-challenge";
import axios from "axios";

async function oauth2Callback(code) {
  const code_verifier = window.sessionStorage.getItem("code_verifier");
  window.sessionStorage.removeItem("code_verifier");
  const response = await axios.post(
    process.env.DIRECTORY_HOST + "/oauth/access_token.json",
    {
      client_id: process.env.DIRECTORY_OAUTH_CLIENT_ID,
      client_secret: process.env.DIRECTORY_OAUTH_CLIENT_SECRET,
      code_verifier,
      code
    }
  );

  window.sessionStorage.setItem(
    "directory_authentication",
    JSON.stringify(response.data)
  );
  window.location.href = "/";
}

const login = document.getElementById("login");

if (window.location.search.includes("code=")) {
  oauth2Callback(window.location.search.replace("?code=", "").split("&")[0]);
} else if (window.sessionStorage.getItem("directory_authentication")) {
  const data = JSON.parse(
    window.sessionStorage.getItem("directory_authentication")
  );
  console.log("LOGGED IN", data);
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + data.access_token;
  axios
    .get(process.env.DIRECTORY_HOST + "/api/v1/person.json")
    .then(response => {
      console.log("AS", response.data);
      document.body.innerHTML = `<div>Hello, ${response.data.full_name}</div>`;
    });
}

login.addEventListener("click", () => {
  const { code_verifier, code_challenge } = pkceChallenge();
  // Store code_verifier
  window.sessionStorage.setItem("code_verifier", code_verifier);
  // Open the page in a new window, then redirect back to a page that calls `oauth2Callback`.
  window.open(
    process.env.DIRECTORY_HOST +
      "/oauth/authorize?client_id=" +
      process.env.DIRECTORY_OAUTH_CLIENT_ID +
      "&code_challenge_method=S256&code_challenge=" +
      code_challenge
  );
});
