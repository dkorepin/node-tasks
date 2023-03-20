import React, { FC, useCallback, useContext, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "react-bootstrap";
import { TUser } from "./user.types";
import { userFields } from "./user-consts";
import { fetchUpdateUser } from "./user.api";
import { ErrorsContext } from "../simple-alert";

export const UserCard: FC<{
  user: TUser;
  onDeleteUser: (id: string) => Promise<void>;
  onRefresh: () => void;
}> = ({ user, onDeleteUser, onRefresh }) => {
  const errorContext = useContext(ErrorsContext);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [userForm, setUserForm] = useState<Partial<TUser>>( {});

  const handleDelete = useCallback(
    () => onDeleteUser(user.id),
    [onDeleteUser, user.id]
  );

  const handleOpenEdit = useCallback(() => {
    setIsShowEdit(true);
    setUserForm({...user});
  }, [user]);
  const handleCloseEdit = useCallback(() => setIsShowEdit(false), []);

  const handleSave = useCallback(async () => {
    setIsFetching(true);
    await fetchUpdateUser(userForm, errorContext.onError);
    setIsShowEdit(false);
    setIsFetching(false);
    onRefresh();
  }, [errorContext.onError, onRefresh, userForm]);

  const handleChangeUserForm = useCallback(
    (key: keyof TUser): React.ChangeEventHandler<HTMLInputElement> =>
      (event) => {
        setUserForm((form) => ({ ...form, [key]: event.target.value }));
      },
    []
  );
  

  return (
    <>
      <Card className="user-card" bg="dark" text="light">
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
