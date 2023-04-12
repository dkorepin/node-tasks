import React from "react";
import "./App.scss";
import { ErrorsProvider } from "./simple-alert";
import { AuthProvider } from "./login";
import { MainTabs } from "./main-tabs";

function App() {
  return (
    <div className="App">
      <ErrorsProvider>
        <AuthProvider>
          <MainTabs/>
        </AuthProvider>
      </ErrorsProvider>
    </div>
  );
}

export default App;
