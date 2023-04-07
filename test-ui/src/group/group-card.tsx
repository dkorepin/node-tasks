import { FC, useCallback, useContext, useState } from "react";
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
import { Permission, TGroup } from "./group-types";
import { ErrorsContext } from "../simple-alert";
import { fetchUpdateGroup } from "./group-api";

export const GroupCard: FC<{
  group: TGroup;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}> = ({ group, onRefresh, onDelete }) => {
  const errorContext = useContext(ErrorsContext);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [groupForm, setGroupForm] = useState<{
    name: string;
    permissions: string;
  }>({
    name: "Test Name",
    permissions: "READ,WRITE",
  });

  const handleDelete = useCallback(
    () => onDelete(group.id),
    [onDelete, group.id]
  );

  const handleOpenEdit = useCallback(() => {
    setIsShowEdit(true);
    setGroupForm({
      name: group.name,
      permissions: group.permissions.join(","),
    });
  }, [group]);
  const handleCloseEdit = useCallback(() => setIsShowEdit(false), []);

  const handleSave = useCallback(async () => {
    setIsFetching(true);
    await fetchUpdateGroup(
      {
        id: group.id,
        name: groupForm.name,
        permissions: groupForm.permissions
          .split(",")
          .map((per) => per.trim()) as Permission[],
      },
      errorContext.onError
    );
    setIsShowEdit(false);
    setIsFetching(false);
    onRefresh();
  }, [
    group.id,
    groupForm.name,
    groupForm.permissions,
    errorContext.onError,
    onRefresh,
  ]);

  const handleChangeGroupForm = useCallback(
    (key: keyof TGroup): React.ChangeEventHandler<HTMLInputElement> =>
      (event) => {
        setGroupForm((form) => ({ ...form, [key]: event.target.value }));
      },
    []
  );

  return (
    <>
      <Card className="custom-card" bg="dark" text="light">
        <Card.Header className="wrapped">Name: {group.name}</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item className="wrapped" variant="dark">
            permissions: {group.permissions.join(", ")}
          </ListGroup.Item>
          <ListGroup.Item className="wrapped" variant="dark">
            users: {group.users.map((user) => user.login).join(", ")}
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
        <ModalHeader closeButton>{group.name}</ModalHeader>
        <ModalBody>
          <ListGroup>
            <ListGroup.Item className="wrapped">
              <Col sm={3} className="mb-1">
                <Form.Label className="white-text">Name</Form.Label>
              </Col>
              <Col sm={12} className="mb-1">
                <Form.Control
                  type="text"
                  placeholder={`Enter name`}
                  value={groupForm.name || ""}
                  onChange={handleChangeGroupForm("name")}
                />
              </Col>
            </ListGroup.Item>
            <ListGroup.Item className="wrapped">
              <Col sm={3} className="mb-1">
                <Form.Label className="white-text">Permissions</Form.Label>
              </Col>
              <Col sm={12} className="mb-1">
                <Form.Control
                  type="text"
                  placeholder={`Enter permissions`}
                  value={groupForm.permissions || ""}
                  onChange={handleChangeGroupForm("permissions")}
                />
              </Col>
            </ListGroup.Item>
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
