import axios from "axios";

import {
  authorize,
  createAccessToken,
  login,
  logout,
  getAccessToken,
  isLoggedIn,
} from "./auth";

if (isLoggedIn()) {
  // Provide Authorization header on all future requests
  axios.defaults.headers.common["Authorization"] = "Bearer " + getAccessToken();
}

const logoutBtn = document.getElementById("logout");
const authenticated_area = document.getElementById("authenticated_area");

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
  axios
    .get(process.env.DIRECTORY_HOST + "/api/v1/person.json")
    .then((response) => {
      console.log("LOGGED IN AS", response.data);
      authenticated_area.style.display = "block";
      document.getElementById(
        "authenticated_area_header"
      ).innerHTML = `<div>Welcome, ${response.data.full_name}</div>`;
      if (window.zaiLaunchpad) {
        window.zaiLaunchpad.setup({
          activeAppName: "redirect_flow_demonstrator",
          loadPersonData: () => response.data,
          directoryHost: process.env.DIRECTORY_HOST,
          helpMenu: [
            {
              label: "Developer Hub",
              url: "https://docs.zaikio.com/",
            },
          ],
        });
      }
    });
} else {
  authorize();
}

// When clicking on Logout button...
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "/";
});
