// App.tsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { store } from "./store";
import i18n from "./i18n";

import Layout from "./components/Layout";
import DevicesPage from "./features/devices/DevicesPage";
import PolicyPage from "./features/policies/PolicyPage";

import AuthProvider from "./auth/AuthProvider";
import PrivateRoute from "./auth/PrivateRoute";

const App = () => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route
                  path="/devices"
                  element={
                    <PrivateRoute>
                      <DevicesPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/policies"
                  element={
                    <PrivateRoute>
                      <PolicyPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
