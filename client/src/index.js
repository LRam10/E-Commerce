import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../src/app/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
    <Provider store={store}>
      <Router basename="/">
        <App />
      </Router>
    </Provider>
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
