// import ReactDOM from "react-dom";
// import { BrowserRouter as Router } from "react-router-dom";
// import App from "./App";
import React from "react"
import {createRoot} from 'react-dom/client';


// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { store } from "./app/store";
// import { Provider } from "react-redux";
const root = createRoot(document.getElementById('root'));
root.render(<div>Hello App</div>);
// ReactDOM.render(
//   // <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
//   //   <Provider store={store}>
//   //     <Router basename="/">
//   //       <App />
//   //     </Router>
//   //   </Provider>
//   // </GoogleOAuthProvider>
//   <div>Hello</div>,
//   document.getElementById("root")
// );
