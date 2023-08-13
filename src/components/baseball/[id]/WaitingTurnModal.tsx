import { colors } from "@mui/material";
import { Modal, ModalProps, Spin } from "antd";
import React from "react";
import styled from "styled-components";

const WaitingTurnModalBlock = styled(Modal)`
  .baseball-game-waiting-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    font-size: 15px;
    color: ${colors.grey[700]};
    font-weight: bold;
  }
`;

interface WaitingTurnModalProps extends ModalProps {}

const WaitingTurnModal: React.FC<WaitingTurnModalProps> = (props) => {
  const { ...modalProps } = props;
  return (
    <WaitingTurnModalBlock {...modalProps}>
      <div className="baseball-game-waiting-modal">
        <div>
          <Spin />
        </div>
        <div>상대방의 차례입니다.</div>
      </div>
    </WaitingTurnModalBlock>
  );
};

export default WaitingTurnModal;
