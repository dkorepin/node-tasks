

import { FC } from "react";
import {
  ListGroup,
} from "react-bootstrap";
import { TUser } from "./user-types";

export const UserGroups: FC<{
  user: TUser;
}> = ({ user}) => {

  const groups = user.groups;
 
  return (
    <>
        <ListGroup variant="flush">
          <ListGroup.Item className="wrapped" variant="dark">
            Groups: {groups.length > 0 ? groups.map((group) => <div>{group.name}</div>) : 'empty'}
          </ListGroup.Item>
        </ListGroup>
    </>
  );
};
