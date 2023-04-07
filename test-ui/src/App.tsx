import React from "react";
import "./App.scss";
import { UserPage } from "./user/user-page";
import { ErrorsProvider } from "./simple-alert";
import { Tab, Tabs } from "react-bootstrap";
import { GroupsPage } from "./group/group-page";

function App() {
  return (
    <div className="App">
      <ErrorsProvider>
        <Tabs
          defaultActiveKey="users"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="users" title="Users">
            <UserPage />
          </Tab>
          <Tab eventKey="groups" title="Groups">
            <GroupsPage />
          </Tab>
        </Tabs>
      </ErrorsProvider>
    </div>
  );
}

export default App;
