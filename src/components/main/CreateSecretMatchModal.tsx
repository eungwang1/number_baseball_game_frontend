import { colors } from "@mui/material";
import { Button, Modal, ModalProps } from "antd";
import React from "react";
import { PacmanLoader } from "react-spinners";
import styled from "styled-components";

const CreateSecretMatchModalBlock = styled(Modal)`
  .create-secret-match-modal-inner {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: ${colors.grey[800]};
  }
  .create-secret-match-modal-description {
    font-size: 14px;
    color: ${colors.grey[700]};
  }
  .create-secret-match-modal-code {
    font-size: 24px;
    font-weight: 900;
    color: ${colors.blue[700]};
    letter-spacing: 0.3em;
  }
`;

interface CreateSecretMatchModalProps extends ModalProps {
  secretCode: number;
  hadleCancelSecretMatching: () => void;
}

const CreateSecretMatchModal: React.FC<CreateSecretMatchModalProps> = (
  props
) => {
  const { secretCode, hadleCancelSecretMatching, ...modalProps } = props;
  return (
    <CreateSecretMatchModalBlock
      {...modalProps}
      cancelText={null}
      closeIcon={null}
      footer={false}
    >
      <div className="create-secret-match-modal-inner">
        <p className="create-secret-match-modal-description">
          입장을 기다리는 중입니다.
        </p>
        <p className="create-secret-match-modal-code">{secretCode}</p>
        <PacmanLoader color={colors.blue[600]} />
        <Button onClick={hadleCancelSecretMatching}>취소하기</Button>
      </div>
    </CreateSecretMatchModalBlock>
  );
};

export default CreateSecretMatchModal;
