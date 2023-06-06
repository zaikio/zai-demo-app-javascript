import axios from "axios";

import {
  authorize,
  createAccessToken,
  login,
  logout,
  getAccessToken,
  isLoggedIn, authorize_on_behalf, isTokenOnBehalfOf,
} from "./auth";

const logoutBtn = document.getElementById("logout");
const loginBtn = document.getElementById("login");
const loginOnBehalfBtn = document.getElementById("login-on-behalf");
const authenticated_area = document.getElementById("authenticated_area");
const authenticated_area_org = document.getElementById("authenticated_area_org");

if (isLoggedIn()) {
  // Provide Authorization header on all future requests
  axios.defaults.headers.common["Authorization"] = "Bearer " + getAccessToken();
}


if (window.location.search.includes("code=")) {
  // When coming back to redirect uri
  const code = window.location.search.replace("?code=", "").split("&")[0];
  createAccessToken(code).then((data) => {
    // Store token
    login(data);

    // Redirect again to omit code
    window.location.href = "/";
  });
} else if (isLoggedIn()) {
  // Fetch basic data about the authorized person
  if(isTokenOnBehalfOf()) {
    axios
      .get(process.env.DIRECTORY_HOST + "/api/v1/organization.json")
      .then((response) => {
        authenticated_area_org.hidden = false;
        authenticated_area_org.innerHTML = `<div>You are authenticated on behalf of ${response.data.name}</div>`;
      }).catch(error => {
        authenticated_area_org.hidden = false;
        var errorMessage;
        if (error.response.status === 403) {
          errorMessage = `<div>Not enough permissions, ask your administrator to allow the needed scopes.</div>`;
        } else {
          errorMessage = `<div>Unexpected error with the request.</div>`;
        }
        authenticated_area_org.innerHTML = errorMessage
    });
  }
  
  axios
    .get(process.env.DIRECTORY_HOST + "/api/v1/person.json")
    .then((response) => {
      authenticated_area.hidden = false;
      document.getElementById(
        "authenticated_area_header"
      ).innerHTML = `<div>Welcome, ${response.data.full_name}</div>`;
      document.getElementById("unauthenticated_area").hidden = true;
    });

}

// When clicking on Logout button...
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "/";
});

loginBtn.addEventListener("click", () => {
  authorize();
});

loginOnBehalfBtn.addEventListener("click", () => {
  authorize_on_behalf();
});
