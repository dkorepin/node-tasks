import { FC, useCallback, useContext, useState } from "react";
import {
  Tab,
  Tabs,
} from "react-bootstrap";
import { UserPage } from "./user/user-page";
import { GroupsPage } from "./group/group-page";
import { AuthContext } from "./login";

export const MainTabs: FC = () => {
  const authContext = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState("users");

  const handleChangeTab = useCallback((tabName: string | null) => {
    if (tabName === "logout") {
      authContext.logout();
      setCurrentTab("users");

      return;
    }
    setCurrentTab(tabName || "users");
  }, []);
  return (
    <Tabs
      id="uncontrolled-tab-example"
      className="mb-3"
      activeKey={currentTab}
      onSelect={handleChangeTab}
    >
      <Tab eventKey="users" title="Users">
        <UserPage />
      </Tab>
      <Tab eventKey="groups" title="Groups">
        <GroupsPage />
      </Tab>
      <Tab eventKey="logout" title="Logout"></Tab>
    </Tabs>
  );
};
