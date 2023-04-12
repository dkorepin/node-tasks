import React, { FC, createContext, useCallback, useState } from "react";
import { Button, Col, Form, ListGroup, Modal, Spinner } from "react-bootstrap";
import { TUser } from "./user/user-types";
import { handleErrors } from "./api-helpers";
import { OnErrorHandler } from "./simple-alert";

export const AuthContext = createContext({
  token: "",
  logout: () => {},
});

const fetchLogin = async (data: Partial<TUser>, onError: OnErrorHandler) => {
  try {
    const headers = new Headers();
    headers.set("content-type", "application/json");

    const response = await fetch("http://localhost:3001/login", {
      method: "Post",
      headers,
      body: JSON.stringify({
        login: data.login,
        password: data.password,
      }),
    });
    const json = await response.json();

    handleErrors(response, json, onError);

    return json;
  } catch (e) {
    console.error(e);
  }
};

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [token, setToken] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const logout = useCallback(() => {
    setToken("");
    setIsAuthenticated(false);
  }, []);

  const handleLogin = useCallback(async () => {
    setIsFetching(true);
    const result = await fetchLogin({ login, password }, console.log);

    if (result.token) {
      setIsAuthenticated(true);
      setToken(result.token);
    }
    setIsFetching(false);
  }, [login, password]);

  const handleChangeLogin: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => {
      setLogin(event.target.value);
    }, []);
  const handleChangePassword: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => {
      setPassword(event.target.value);
    }, []);

  const handleSkip = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        logout,
      }}
    >
      {isAuthenticated ? (
        children
      ) : (
        <Modal show>
          <Modal.Header>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              <ListGroup.Item className="wrapped">
                <Col sm={3} className="mb-1">
                  <Form.Label className="white-text">Login</Form.Label>
                </Col>
                <Col sm={12} className="mb-1">
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder={"Login"}
                    value={login}
                    onChange={handleChangeLogin}
                    autoComplete="username email"
                  />
                </Col>
              </ListGroup.Item>
              <ListGroup.Item className="wrapped">
                <Col sm={3} className="mb-1">
                  <Form.Label className="white-text">Password</Form.Label>
                </Col>
                <Col sm={12} className="mb-1">
                  <Form.Control
                    type="password"
                    placeholder={"Password"}
                    value={password}
                    autoComplete="new-password"
                    name="password"
                    onChange={handleChangePassword}
                  />
                </Col>
              </ListGroup.Item>
            </ListGroup>
            {isFetching && (
              <div className="spinner-container">
                <Spinner animation="border" role="status"></Spinner>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="primary" onClick={handleSkip}>
              Skip
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </AuthContext.Provider>
  );
};
