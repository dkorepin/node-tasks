import React, { FC, createContext, useCallback, useState } from "react";
import { Alert } from "react-bootstrap";

export type OnErrorHandler = (text: string) => void;
export const ErrorsContext = createContext({
  error: "",
  onError: (_text: string) => {},
});

export const ErrorsProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState("");
  const handleError = useCallback((text: string) => {
    setError(text);
  }, []);

  return (
    <ErrorsContext.Provider
      value={{
        error,
        onError: handleError,
      }}
    >
      {!!error && (
        <Alert variant="danger" onClose={() => handleError('')} dismissible>
          <Alert.Heading>Something went wrong</Alert.Heading>
          <p className="mb-0">{error}</p>
        </Alert>
      )}
      {children}
    </ErrorsContext.Provider>
  );
};
