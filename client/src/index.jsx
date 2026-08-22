import App from "./App";
import React from "react"
import {createRoot} from 'react-dom/client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
const root = createRoot(document.getElementById('root'));
const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      //4xx is a real answer, not a transient failure, retrying it just spams the server
      retry:(failureCount, error)=>{
        console.log(error);
        if((error?.status >= 400 || error?.status === 429) && error?.status < 500) return false;
        return failureCount < 3;
      }
    }
  }
});
root.render(
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_KEY}>

<QueryClientProvider client={queryClient}>
  <App/>
</QueryClientProvider>
</GoogleOAuthProvider>
);

