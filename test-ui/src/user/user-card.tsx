import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  ListGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "react-bootstrap";
import { TUser } from "./user-types";
import { userFields } from "./user-consts";
import { fetchAddGroup, fetchUpdateUser } from "./user-api";
import { ErrorsContext } from "../simple-alert";
import { UserGroups } from "./user-groups";
import { fetchGroups } from "../group/group-api";
import { TGroup } from "../group/group-types";
import { AuthContext } from "../login";

export const UserCard: FC<{
  user: TUser;
  onDeleteUser: (id: string) => Promise<void>;
  onRefresh: () => void;
}> = ({ user, onDeleteUser, onRefresh }) => {
  const errorContext = useContext(ErrorsContext);
  const authContext = useContext(AuthContext);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [userForm, setUserForm] = useState<Partial<Omit<TUser, "groups">>>({});
  const [groupList, setGroupList] = useState<{group?: TGroup[]}>({});

  const handleDelete = useCallback(
    () => onDeleteUser(user.id),
    [onDeleteUser, user.id]
  );

  const handleFetchGroups = useCallback(async () => {
    setIsFetching(true);
    await fetchGroups(authContext.token, setGroupList, errorContext.onError);
    setIsFetching(false);
  }, [authContext.token, errorContext.onError]);

  const handleOpenEdit = useCallback(() => {
    setIsShowEdit(true);
    handleFetchGroups();
    setUserForm({ ...user });
  }, [user, handleFetchGroups]);
  const handleCloseEdit = useCallback(() => setIsShowEdit(false), []);

  const handleSave = useCallback(async () => {
    setIsFetching(true);
    await fetchUpdateUser(userForm, authContext.token, errorContext.onError);
    setIsShowEdit(false);
    setIsFetching(false);
    onRefresh();
  }, [authContext.token, errorContext.onError, onRefresh, userForm]);

  const handleAddGroup = useCallback(
    (groupId: string) => async () => {
      setIsFetching(true);
      await fetchAddGroup(
        { userId: userForm.id, groupId },
        authContext.token,
        errorContext.onError
      );
      setIsShowEdit(false);
      setIsFetching(false);
      onRefresh();
    },
    [authContext.token, errorContext.onError, onRefresh, userForm]
  );

  const handleChangeUserForm = useCallback(
    (
        key: keyof Omit<TUser, "groups">
      ): React.ChangeEventHandler<HTMLInputElement> =>
      (event) => {
        setUserForm((form) => ({ ...form, [key]: event.target.value }));
      },
    []
  );

  return (
    <>
      <Card className="custom-card" bg="dark" text="light">
        <Card.Header className="wrapped">Login {user.login}</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item className="wrapped" variant="dark">
            id: {user.id}
          </ListGroup.Item>
          <ListGroup.Item className="wrapped" variant="dark">
            Password: {user.password}
          </ListGroup.Item>
          <ListGroup.Item className="wrapped" variant="dark">
            Age: {user.age}
          </ListGroup.Item>
          <ListGroup.Item variant="dark">
            <UserGroups user={user} />
          </ListGroup.Item>
          <ListGroup.Item variant="dark">
            <Button variant="danger" onClick={handleDelete}>
              Remove
            </Button>
            <Button className="second-button" onClick={handleOpenEdit}>
              Edit
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Card>
      <Modal
        show={isShowEdit}
        onEscapeKeyDown={handleCloseEdit}
        onHide={handleCloseEdit}
      >
        <ModalHeader closeButton>{user.login}</ModalHeader>
        <ModalBody>
          <ListGroup>
            {userFields.map((key) => (
              <ListGroup.Item className="wrapped">
                <Col sm={3} className="mb-1">
                  <Form.Label className="white-text">{key}</Form.Label>
                </Col>
                <Col sm={12} className="mb-1">
                  <Form.Control
                    type="text"
                    placeholder={`Enter ${key}`}
                    value={userForm[key] || ""}
                    onChange={handleChangeUserForm(key)}
                  />
                </Col>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button className="mt-3" onClick={handleSave}>
            Save
          </Button>
          <Dropdown className="mt-3 second-button">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Set group
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {groupList?.group?.map((group) => (
                <Dropdown.Item onClick={handleAddGroup(group.id)}>
                  {group.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {isFetching && (
            <div className="spinner-container">
              <Spinner animation="border" role="status"></Spinner>
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};
