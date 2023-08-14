import { colors } from "@mui/material";
import { Button, Input, Modal, ModalProps } from "antd";
import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

const JoinSecretMatchModalBlock = styled(Modal)`
  .join-secret-match-modal-title {
    font-size: 18px;
    font-weight: 900;
    color: ${colors.blue[700]};
    font-style: italic;
  }
  .join-secret-match-modal-inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

interface JoinSecretMatchModalProps extends ModalProps {
  secretCodeInput: string;
  isSecretMatching: boolean;
  setSecretCodeInput: Dispatch<SetStateAction<string>>;
  handleJoinSecretMatch: () => void;
}

const JoinSecretMatchModal: React.FC<JoinSecretMatchModalProps> = (props) => {
  const {
    secretCodeInput,
    isSecretMatching,
    setSecretCodeInput,
    handleJoinSecretMatch,
    ...modalProps
  } = props;
  return (
    <JoinSecretMatchModalBlock {...modalProps} cancelText={null} footer={false}>
      <div className="join-secret-match-modal-inner">
        <p className="join-secret-match-modal-title">숫자야구 온라인</p>
        <Input
          size="large"
          placeholder="코드를 입력해주세요"
          onChange={(e) => setSecretCodeInput(e.target.value)}
        />
        <Button
          className="join-secret-match-modal-button"
          type="primary"
          size="large"
          loading={isSecretMatching}
          onClick={handleJoinSecretMatch}
          disabled={secretCodeInput.length !== 4}
        >
          입장하기
        </Button>
      </div>
    </JoinSecretMatchModalBlock>
  );
};

export default JoinSecretMatchModal;
