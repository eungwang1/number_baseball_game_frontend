import { colors } from "@mui/material";
import { Button, Modal, ModalProps } from "antd";
import React from "react";
import { PacmanLoader } from "react-spinners";
import styled from "styled-components";

const RandomMatchModalBlock = styled(Modal)`
  .random-match-modal-inner {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: ${colors.grey[800]};
  }
`;

interface RandomMatchModalProps extends ModalProps {
  handleCancelMatching: () => void;
}

const RandomMatchModal: React.FC<RandomMatchModalProps> = (props) => {
  const { handleCancelMatching, ...modalProps } = props;
  return (
    <RandomMatchModalBlock
      {...modalProps}
      cancelText={null}
      closeIcon={null}
      footer={false}
    >
      <div className="random-match-modal-inner">
        <PacmanLoader color={colors.blue[600]} />
        <p>상대를 찾고있습니다.</p>
        <Button onClick={handleCancelMatching}>매칭 취소하기</Button>
      </div>
    </RandomMatchModalBlock>
  );
};

export default RandomMatchModal;
