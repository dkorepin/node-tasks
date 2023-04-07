import { FC } from "react";
import { Col, Spinner } from "react-bootstrap";
import { GroupCard } from "./group-card";
import { TGroup } from "./group-types";

export const GroupsContainer: FC<{
  groupList: TGroup[];
  isFetching: boolean;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}> = ({ groupList, isFetching, onRefresh, onDelete }) => {
  return (
    <Col sm={12}>
      <div className="card-container">
        {groupList.map((group) => (
          <GroupCard group={group} key={group.id} onDelete={onDelete}  onRefresh={onRefresh} />
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
