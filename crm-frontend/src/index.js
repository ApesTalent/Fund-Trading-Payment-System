import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthPage from "views/auth/signIn";
import AdminLayout from "layouts/admin";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import AuthVerify from "./contexts/auth-verify";
import PrivateRoute from "./contexts/PrivateRoute";
import { ToastContainer } from "react-toastify";
import FormLayout from "views/form";
import { AuthProvider } from "./contexts/AuthProvider";

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ThemeEditorProvider>
        <AuthProvider>
          <HashRouter>
            <Switch>
              <Route path={`/auth/sign-in`} component={AuthPage} />
              <Route path={`/form`} component={FormLayout} />
              <PrivateRoute path={`/admin`} component={AdminLayout} />
              <Redirect from="/" to="/auth/sign-in" />
            </Switch>
            <AuthVerify />
          </HashRouter>
        </AuthProvider>
        <ToastContainer />
      </ThemeEditorProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
