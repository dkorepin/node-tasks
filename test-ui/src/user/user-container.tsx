import { FC } from "react";
import { Col, Spinner } from "react-bootstrap";
import { UserCard } from "./user-card";
import { TUser } from "./user.types";

export const UserContainer: FC<{
  userList: TUser[];
  isFetching: boolean;
  onDeleteUser: (id: string) => Promise<void>;
  onRefresh: () => void;
}> = ({ userList, isFetching, onDeleteUser, onRefresh }) => {
  return (
    <Col sm={12}>
      <div className="card-container">
        {userList.map((user) => (
          <UserCard user={user} key={user.id} onDeleteUser={onDeleteUser} onRefresh={onRefresh}/>
        ))}
        {isFetching && (
          <div className="spinner-container">
            <Spinner animation="border" role="status"></Spinner>
          </div>
        )}
      </div>
    </Col>
  );
};
