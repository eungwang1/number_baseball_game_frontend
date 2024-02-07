import { Input, Modal, ModalProps, Spin, message } from "antd";
import React, { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import {
  BASEBALL_GAME_EMIT_EVENTS,
  BASEBALL_GAME_SUBSCRIBE_EVENTS,
} from "../baseball.constants";
import { Socket } from "socket.io-client";
import { colors } from "@mui/material";

const NumberRegistrationModalBlock = styled(Modal)`
  .number-register-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .number-register-waiting-wrapper {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .number-register-waiting-text {
    font-size: 16px;
    font-weight: bold;
    color: ${colors.grey[600]};
  }

  .number-register-modal-inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .number-register-button {
    margin-top: 10px;
    width: 100%;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

interface NumberRegistrationModalProps extends ModalProps {
  socket: Socket | null;
  number: string;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  isRegisterNumber: boolean;
}

const NumberRegistrationModal: React.FC<NumberRegistrationModalProps> = (
  props
) => {
  const { number, socket, setNumber, isRegisterNumber, ...modalProps } = props;

  const handleRegisterNumber = (e: FormEvent) => {
    e.preventDefault();
    if (!socket) message.error("연결 상태를 확인해주세요.");
    if (isRegisterNumber) return;
    if (number.length !== 4) return message.error("4자리 숫자를 입력해주세요.");
    const baseballNumberArray = number.split("");
    const isNumber = baseballNumberArray.every((n) => !isNaN(parseInt(n)));
    if (!isNumber) return message.error("숫자만 입력해야 합니다.");
    const isUnique = new Set(baseballNumberArray).size === 4;
    if (!isUnique) return message.error("숫자는 중복되지 않아야 합니다.");
    socket?.emit(BASEBALL_GAME_EMIT_EVENTS.SET_BALL_NUMBER, {
      baseballNumber: number,
    });
    setNumber("");
  };

  return (
    <NumberRegistrationModalBlock {...modalProps}>
      {isRegisterNumber ? (
        <div className="number-register-waiting-wrapper">
          <span className="number-register-waiting-loader-wrapper">
            <Spin />
          </span>
          <span className="number-register-waiting-text">
            상대방을 기다리고 있습니다...
          </span>
        </div>
      ) : (
        <form
          className="number-register-modal-inner"
          onSubmit={handleRegisterNumber}
        >
          <p className="number-register-title">야구번호를 등록해주세요</p>
          <Input
            placeholder="4자리 숫자를 입력해주세요."
            size="large"
            value={number}
            inputMode="none"
            readOnly
          />
        </form>
      )}
    </NumberRegistrationModalBlock>
  );
};

export default NumberRegistrationModal;
