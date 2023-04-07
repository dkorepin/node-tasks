import { FC, useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Permission, TGroup } from "./group-types";
import { ErrorsContext } from "../simple-alert";
import { fetchCreateGroup, fetchDeleteGroup, fetchGroups } from "./group-api";
import { GroupsContainer } from "./group-container";

export const GroupsPage: FC = () => {
  const errorContext = useContext(ErrorsContext);
  const [groupList, setGroupList] = useState<TGroup[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [groupForm, setGroupForm] = useState<{
    name: string;
    permissions: string;
  }>({
    name: "Test Name",
    permissions: "READ,WRITE",
  });

  const handleFetchGroups = useCallback(async () => {
    setIsFetching(true);
    await fetchGroups(setGroupList, errorContext.onError);
    setIsFetching(false);
  }, [errorContext.onError]);

  const handleDeleteGroup = useCallback(
    async (id: string) => {
      setIsFetching(true);
      await fetchDeleteGroup(id, errorContext.onError);
      handleFetchGroups();
    },
    [handleFetchGroups, errorContext.onError]
  );

  const handleCreateGroup = useCallback(async () => {
    setIsFetching(true);
    await fetchCreateGroup(
      {
        name: groupForm.name,
        permissions: groupForm.permissions
          .split(",")
          .map((per) => per.trim()) as Permission[],
      },
      errorContext.onError
    );
    handleFetchGroups();
  }, [groupForm, handleFetchGroups, errorContext.onError]);

  const handleChangeGroupForm = useCallback(
    (key: keyof TGroup): React.ChangeEventHandler<HTMLInputElement> =>
      (event) => {
        setGroupForm((form) => ({ ...form, [key]: event.target.value }));
      },
    []
  );

  useEffect(() => {
    handleFetchGroups();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid="sm">
      <Row className="mb-2">
        <Col sm={11}></Col>
        <Col sm={1}>
          <Button onClick={handleFetchGroups}>Search</Button>
        </Col>
      </Row>
      <Row className="mb-2">
        <GroupsContainer
          onRefresh={handleFetchGroups}
          groupList={groupList}
          onDelete={handleDeleteGroup}
          isFetching={isFetching}
        />
      </Row>
      <Row>
        <Form.Label className="white-text" sm={12} column>
          Create new Group
        </Form.Label>

        <Row className="pl-o pr-0">
          <Col sm={3} className="mb-1">
            <Form.Label className="white-text">Name</Form.Label>
          </Col>
          <Col sm={9} className="mb-1">
            <Form.Control
              type="text"
              placeholder={`Enter name`}
              value={groupForm.name || ""}
              onChange={handleChangeGroupForm("name")}
            />
          </Col>
        </Row>
        <Row className="pl-o pr-0">
          <Col sm={3} className="mb-1">
            <Form.Label className="white-text">Permissions</Form.Label>
          </Col>
          <Col sm={9} className="mb-1">
            <Form.Control
              type="text"
              placeholder={`Enter permissions`}
              value={groupForm.permissions || ""}
              onChange={handleChangeGroupForm("permissions")}
            />
          </Col>
        </Row>

        <Col sm={12} className="mb-5">
          <Button onClick={handleCreateGroup}>Add Group</Button>
        </Col>
      </Row>
    </Container>
  );
};
