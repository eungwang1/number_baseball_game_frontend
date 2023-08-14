"use client";

import useSocket from "@/libs/hooks/useSocket";
import { Dialog, colors } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MatchedResponse } from "./main.type";
import { PacmanLoader } from "react-spinners";
import { Button, Card, Modal, message } from "antd";
import {
  BASEBALL_EMIT_EVENTS,
  BASEBALL_SUBSCRIBE_EVENTS,
} from "./main.constants";

const MainComponentBlock = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .main-random-matching-button {
    width: 100%;
  }
  .main-button-wrapper {
    display: block;
    margin-top: auto;
  }
`;

const MatchingModal = styled(Modal)`
  .main-random-matching-dialog-inner {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: ${colors.grey[100]};
  }
  .ant-modal-content {
    background-color: unset !important;
    box-shadow: unset !important;
  }
  .ant-modal-close {
    display: none;
  }
`;

interface MainComponentProps {}

const MainComponent: React.FC<MainComponentProps> = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [matchedData, setMatchedData] = useState<MatchedResponse | null>(null);
  const router = useRouter();
  const socket = useSocket(process.env.NEXT_PUBLIC_API_URL as string);
  useEffect(() => {
    if (socket) {
      socket.on(BASEBALL_SUBSCRIBE_EVENTS.MATCHED, (data: MatchedResponse) => {
        setIsMatching(false);
        setIsMatched(true);
        setMatchedData(data);
      });
      socket.on(BASEBALL_SUBSCRIBE_EVENTS.MATCH_APPROVED, (data) => {
        router.push(`/baseball/${data.roomId}`);
      });
      socket.on(BASEBALL_SUBSCRIBE_EVENTS.MATCH_CANCELED, () => {
        console.log("match canceled");
        setIsMatched(false);
        setIsPending(false);
        message.info("상대가 매칭을 취소하였습니다.");
      });
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
      socket.emit(BASEBALL_EMIT_EVENTS.REQUEST_RANDOM_MATCH);
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
  return (
    <MainComponentBlock>
      <div className="main-button-wrapper">
        <Button
          onClick={handleRandomMatch}
          className="main-random-matching-button"
          size="large"
          type="primary"
        >
          랜덤매칭
        </Button>
      </div>
      <MatchingModal
        open={isMatching}
        cancelText={null}
        closeIcon={null}
        footer={false}
      >
        <div className="main-random-matching-dialog-inner">
          <PacmanLoader color={colors.grey[100]} />
          <p>상대를 찾고있습니다.</p>
          <Button onClick={handleCancelMatching}>매칭 취소하기</Button>
        </div>
      </MatchingModal>
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
