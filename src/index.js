import pkceChallenge from "pkce-challenge";
import axios from "axios";

const login = document.getElementById("login");
const logout = document.getElementById("logout");
const authenticated_area = document.getElementById("authenticated_area");

// When clicking on Login button...
login.addEventListener("click", () => {
  const { code_verifier, code_challenge } = pkceChallenge();
  // Store code_verifier
  window.sessionStorage.setItem("code_verifier", code_verifier);
  // Open the page in a new window, then redirect back to the same page.
  window.location.href = process.env.DIRECTORY_HOST +
    "/oauth/authorize?client_id=" +
    process.env.DIRECTORY_OAUTH_CLIENT_ID +
    "&redirect_uri=" +
    process.env.DIRECTORY_REDIRECT_URI +
    "&code_challenge_method=S256&code_challenge=" +
    code_challenge +
    "&scope=directory.person.r";
});

if (window.location.search.includes("code=")) {
  // When coming back to redirect uri
  const code = window.location.search.replace("?code=", "").split("&")[0];

  // Fetch code verifier for PKCE that was stored before
  const code_verifier = window.sessionStorage.getItem("code_verifier");
  window.sessionStorage.removeItem("code_verifier");

  // Use code to create access token
  axios
    .post(process.env.DIRECTORY_HOST + "/oauth/access_token.json", {
      client_id: process.env.DIRECTORY_OAUTH_CLIENT_ID,
      code_verifier,
      code
    })
    .then(response => {
      // Store token
      window.sessionStorage.setItem(
        "directory_authentication",
        JSON.stringify(response.data)
      );

      // Redirect again to omit code
      window.location.href = "/";
    });
} else if (window.sessionStorage.getItem("directory_authentication")) {
  // Current session has a stored token
  const data = JSON.parse(
    window.sessionStorage.getItem("directory_authentication")
  );

  // Provide Authorization header on all future requests
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + data.access_token;

  // Fetch basic data about the authorized person
  axios
    .get(process.env.DIRECTORY_HOST + "/api/v1/person.json")
    .then(response => {
      console.log("LOGGED IN AS", response.data);
      authenticated_area.style.display = "block";
      login.style.display = "none";
      document.getElementById(
        "authenticated_area_header"
      ).innerHTML = `<div>Welcome, ${response.data.full_name}</div>`;
      if (window.zaiLaunchpad) {
        window.zaiLaunchpad.setup({ loadPersonData: () => response.data, directoryHost: process.env.DIRECTORY_HOST });
      }
    });

  // When clicking on Logout button...
  logout.addEventListener("click", () => {
    window.sessionStorage.removeItem("directory_authentication");
    window.location.href = "/";
  });
}
