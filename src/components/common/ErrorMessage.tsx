import React from "react";
import styled from "styled-components";

const ErrorMessageBlock = styled.div`
  color: red;
`;

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <ErrorMessageBlock>{message}</ErrorMessageBlock>;
};

export default ErrorMessage;
