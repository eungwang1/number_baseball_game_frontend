"use client";

import useSocket from "@/libs/hooks/useSocket";
import { colors } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  ErrorResponse,
  MatchedResponse,
  SecretMatchCreatedResponse,
} from "./main.type";
import { Button, Modal, Radio, message } from "antd";
import {
  BASEBALL_EMIT_EVENTS,
  BASEBALL_SUBSCRIBE_EVENTS,
  TURN_TIME_LIMIT_OPTIONS,
} from "./main.constants";
import Image from "next/image";
import CreateSecretMatchModal from "./CreateSecretMatchModal";
import JoinSecretMatchModal from "./JoinSecretMatchModal";
import RandomMatchModal from "./RandomMatchModal";

const MainComponentBlock = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .main-glove-image-wrapper {
    margin: 0 auto;
    margin-bottom: 30px;
    max-width: 300px;
    width: 80%;
    aspect-ratio: 1;
    position: relative;
    img {
      opacity: 0.15;
    }
    p {
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 46px;
      text-align: center;
      font-weight: 900;
      width: 100%;
      white-space: pre-line;
      font-style: italic;
      color: ${colors.blue[700]};
    }
  }
  .main-random-matching-button,
  .main-waiting-room-move-button {
    width: 100%;
    height: 60px !important;
  }
  .main-waiting-room-move-button {
    margin-top: 10px;
  }
  .main-code-button {
    width: 100%;
    height: 60px !important;
  }
  .main-code-button-wrapper {
    display: flex;
    margin-top: 10px;
    width: 100%;
    gap: 10px;
  }
  .main-turn-time-limit-label {
    font-size: 16px;
    color: ${colors.grey[700]};
  }
  .main-turn-time-limit-radio-group {
    margin-bottom: 10px;
    label {
      vertical-align: middle;
    }
  }
  .main-body-wrapper {
    display: block;
  }
`;

interface MainComponentProps {}

const MainComponent: React.FC<MainComponentProps> = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [isCreateSecretMatchModalOpen, setIsCreateSecretMatchModalOpen] =
    useState(false);
  const [isJoinSecretMatchModalOpen, setIsJoinSecretMatchModalOpen] =
    useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [secretCodeInput, setSecretCodeInput] = useState<string>("");
  const [secretCode, setSecretCode] = useState<number>(0);
  const [isSecretMatching, setIsSecretMatching] = useState(false);
  const [turnTimeLimit, setTurnTimeLimit] = useState(30);
  const router = useRouter();
  const socket = useSocket(process.env.NEXT_PUBLIC_API_URL as string);
  useEffect(() => {
    if (socket) {
      socket.on(BASEBALL_SUBSCRIBE_EVENTS.MATCHED, (data: MatchedResponse) => {
        setIsMatching(false);
        setIsMatched(true);
      });
      socket.on(BASEBALL_SUBSCRIBE_EVENTS.MATCH_APPROVED, (data) => {
        router.push(
          `/baseball/${data.roomId}?turnTimeLimit=${data.turnTimeLimit}`
        );
      });
      socket.on(BASEBALL_SUBSCRIBE_EVENTS.MATCH_CANCELED, () => {
        setIsMatched(false);
        setIsPending(false);
        message.info("상대가 매칭을 취소하였습니다.");
      });
      socket.on(BASEBALL_SUBSCRIBE_EVENTS.ERROR, (data: ErrorResponse) => {
        message.error(data.message);
        setIsSecretMatching(false);
      });
      socket.on(
        BASEBALL_SUBSCRIBE_EVENTS.SECRET_MATCH_CREATED,
        (data: SecretMatchCreatedResponse) => {
          setSecretCode(data.secretCode);
        }
      );
    }
    return () => {
      if (socket) {
        socket.off(BASEBALL_SUBSCRIBE_EVENTS.MATCHED);
        socket.off(BASEBALL_SUBSCRIBE_EVENTS.MATCH_APPROVED);
        socket.off(BASEBALL_SUBSCRIBE_EVENTS.MATCH_CANCELED);
      }
    };
  }, [socket]);

  const handleRandomMatch = () => {
    try {
      if (!socket?.connected) return message.error("연결에 실패했습니다.");
      socket.emit(BASEBALL_EMIT_EVENTS.REQUEST_RANDOM_MATCH, {
        turnTimeLimit,
      });
      setIsMatching(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleApproveMatching = () => {
    try {
      if (!socket?.connected) return message.error("연결에 실패했습니다.");
      socket.emit(BASEBALL_EMIT_EVENTS.APPROVE_RANDOM_MATCH);
      setIsPending(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelMatching = () => {
    try {
      if (!socket?.connected) return message.error("연결에 실패했습니다.");
      socket.emit(BASEBALL_EMIT_EVENTS.CANCEL_RANDOM_MATCH);
    } catch (e) {
      console.log(e);
    } finally {
      setIsMatching(false);
    }
  };

  const handleCreateSecretMatch = async () => {
    try {
      if (!socket?.connected) return message.error("연결에 실패했습니다.");
      socket.emit(BASEBALL_EMIT_EVENTS.CREATE_SECRET_MATCH, {
        turnTimeLimit,
      });
      setIsCreateSecretMatchModalOpen(true);
    } catch {}
  };

  const handleCancelSecretMatching = () => {
    try {
      if (!socket?.connected) return message.error("연결에 실패했습니다.");
      socket.emit(BASEBALL_EMIT_EVENTS.CANCEL_RANDOM_MATCH);
    } catch (e) {
      console.log(e);
    } finally {
      setIsCreateSecretMatchModalOpen(false);
    }
  };
  const handleCancleMatched = () => {
    try {
      if (!socket?.connected) return message.error("연결에 실패했습니다.");
      socket.emit(BASEBALL_EMIT_EVENTS.CANCEL_RANDOM_MATCH);
    } catch (e) {
      console.log(e);
    } finally {
      setIsMatched(false);
      setIsPending(false);
    }
  };
  const handleJoinSecretMatch = () => {
    try {
      if (!socket?.connected) return message.error("연결에 실패했습니다.");
      socket.emit(BASEBALL_EMIT_EVENTS.JOIN_SECRET_MATCH, {
        secretCode: Number(secretCodeInput),
      });
      setIsSecretMatching(true);
    } catch (e) {
      console.log(e);
      setIsSecretMatching(false);
    }
  };
  return (
    <MainComponentBlock>
      <div className="main-body-wrapper">
        <div className="main-glove-image-wrapper">
          <Image src="/main/glove.png" fill alt="glove-image" />
          <p>{"숫자야구\n온라인"}</p>
        </div>
        <div className="main-turn-time-limit-label">한 턴당 제한시간</div>
        <Radio.Group
          className="main-turn-time-limit-radio-group"
          options={TURN_TIME_LIMIT_OPTIONS}
          onChange={(e) => {
            setTurnTimeLimit(e.target.value);
          }}
          value={turnTimeLimit}
          optionType="button"
        />
        <Button
          onClick={handleRandomMatch}
          className="main-random-matching-button"
          size="large"
          type="primary"
        >
          랜덤매칭
        </Button>
        <div className="main-code-button-wrapper">
          <Button
            onClick={() => setIsJoinSecretMatchModalOpen(true)}
            className="main-code-button"
            size="large"
          >
            코드 입장
          </Button>
          <Button
            onClick={handleCreateSecretMatch}
            className="main-code-button"
            size="large"
          >
            코드 생성
          </Button>
        </div>
      </div>
      <RandomMatchModal
        open={isMatching}
        handleCancelMatching={handleCancelMatching}
      />
      <CreateSecretMatchModal
        open={isCreateSecretMatchModalOpen}
        hadleCancelSecretMatching={handleCancelSecretMatching}
        secretCode={secretCode}
      />
      <JoinSecretMatchModal
        secretCodeInput={secretCodeInput}
        setSecretCodeInput={setSecretCodeInput}
        handleJoinSecretMatch={handleJoinSecretMatch}
        isSecretMatching={isSecretMatching}
        onCancel={() => setIsJoinSecretMatchModalOpen(false)}
        open={isJoinSecretMatchModalOpen}
      />
      <Modal
        open={isMatched}
        cancelText={"취소"}
        okText={isPending ? "승락 대기중..." : "승락"}
        okButtonProps={{
          loading: isPending,
        }}
        onOk={handleApproveMatching}
        onCancel={handleCancleMatched}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          상대가 매칭되었습니다.
        </div>
      </Modal>
    </MainComponentBlock>
  );
};

export default MainComponent;
