import { Input, InputProps } from "antd";
import React from "react";
import styled from "styled-components";

const InputWithErrorBlock = styled.div`
  .input-error-message {
    color: red;
  }
`;

interface InputWithErrorProps extends InputProps {
  errorMessage?: string;
}

const InputWithError: React.FC<InputWithErrorProps> = (props) => {
  const { errorMessage, ...inputProps } = props;
  return (
    <InputWithErrorBlock>
      <Input {...inputProps} />
      {errorMessage && (
        <div className="input-error-message">{errorMessage}</div>
      )}
    </InputWithErrorBlock>
  );
};

export default InputWithError;
