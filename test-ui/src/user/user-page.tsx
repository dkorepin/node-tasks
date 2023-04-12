import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { userFields } from "./user-consts";
import { UserContainer } from "./user-container";
import { fetchCreateUser, fetchDeleteUser, fetchUsers } from "./user-api";
import { TUser } from "./user-types";
import { ErrorsContext } from "../simple-alert";
import { AuthContext } from "../login";

export const UserPage: FC = () => {
  const errorContext = useContext(ErrorsContext);
  const authContext = useContext(AuthContext);
  const [userList, setUserList] = useState<{users?: TUser[]}>({});
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [limit, setLimit] = useState<number>(100);
  const [userForm, setUserForm] = useState<Partial<TUser>>({
    login: "Test Name",
    password: "dfjs66#$dj",
    age: 18,
  });

  const handleChangeSearch: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => {
      setSearch(event.target.value);
    }, []);

  const handleChangeLimit: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => {
      setLimit(Number(event.target.value));
    }, []);

  const handleFetchUser = useCallback(async () => {
    setIsFetching(true);
    await fetchUsers({ limit, search }, authContext.token, setUserList, errorContext.onError);
    setIsFetching(false);
  }, [limit, search, errorContext.onError, authContext.token]);

  const handleChangeUserForm = useCallback(
    (key: keyof TUser): React.ChangeEventHandler<HTMLInputElement> =>
      (event) => {
        setUserForm((form) => ({ ...form, [key]: event.target.value }));
      },
    []
  );

  const handleCreateUser = useCallback(async () => {
    setIsFetching(true);
    await fetchCreateUser(userForm, authContext.token, errorContext.onError);
    handleFetchUser();
  }, [userForm, handleFetchUser, errorContext.onError, authContext.token]);

  const handleDeleteUser = useCallback(
    async (id: string) => {
      setIsFetching(true);
      await fetchDeleteUser(id, authContext.token, errorContext.onError);
      handleFetchUser();
    },
    [handleFetchUser, authContext.token, errorContext.onError]
  );

  useEffect(() => {
    handleFetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid="sm">
      <Row className="mb-2">
        <Col sm={6}>
          <Form.Control
            type="text"
            placeholder="Enter search"
            value={search}
            onChange={handleChangeSearch}
          />
        </Col>
        <Col sm={5}>
          <Form.Control
            type="number"
            placeholder="Enter limit"
            value={limit}
            onChange={handleChangeLimit}
          />
        </Col>
        <Col sm={1}>
          <Button onClick={handleFetchUser}>Search</Button>
        </Col>
      </Row>
      <Row className="mb-2">
        <UserContainer
          onRefresh={handleFetchUser}
          userList={userList?.users || []}
          isFetching={isFetching}
          onDeleteUser={handleDeleteUser}
        />
      </Row>
      <Row>
        <Form.Label className="white-text" sm={12} column>
          Create new User
        </Form.Label>
        {userFields.map((key) => (
          <Row className="pl-o pr-0" key={key}>
            <Col sm={3} className="mb-1">
              <Form.Label className="white-text">{key}</Form.Label>
            </Col>
            <Col sm={9} className="mb-1">
              <Form.Control
                type="text"
                placeholder={`Enter ${key}`}
                value={userForm[key] || ""}
                onChange={handleChangeUserForm(key)}
              />
            </Col>
          </Row>
        ))}

        <Col sm={12} className="mb-5">
          <Button onClick={handleCreateUser}>Add User</Button>
        </Col>
      </Row>
    </Container>
  );
};
