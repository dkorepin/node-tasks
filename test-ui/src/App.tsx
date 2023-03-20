import React from "react";
import "./App.scss";
import { UserPage } from "./user/user-page";
import { ErrorsProvider } from "./simple-alert";

function App() {
  return (
    <div className="App">
      <ErrorsProvider>
        <UserPage />
      </ErrorsProvider>
    </div>
  );
}

export default App;
