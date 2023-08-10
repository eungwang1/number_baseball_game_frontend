"use client";

import useSocket from "@/libs/hooks/useSocket";
import { Dialog, colors } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MatchedResponse } from "./main.type";
import { PacmanLoader } from "react-spinners";
import { Button, Card, Modal } from "antd";
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
  .ant-modal-footer {
    display: none;
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
  const socket = useSocket("http://localhost:80");
  useEffect(() => {
    if (socket) {
      socket.on(BASEBALL_SUBSCRIBE_EVENTS.MATCHED, (data: MatchedResponse) => {
        setIsMatching(false);
        setIsMatched(true);
        setMatchedData(data);
      });
      socket.on(BASEBALL_SUBSCRIBE_EVENTS.MATCH_APPROVED, (data) => {
        setTimeout(() => {
          router.push(`/baseball/${data.roomId}`);
        }, 2000);
      });
    }
    return () => {
      if (socket) {
        socket.off(BASEBALL_SUBSCRIBE_EVENTS.MATCHED);
      }
    };
  }, [socket]);

  const handleRandomMatch = () => {
    if (!socket) return alert("socket is not connected");
    socket.emit(BASEBALL_EMIT_EVENTS.REQUEST_RANDOM_MATCH);
    setIsMatching(true);
  };

  const handleApproveMatching = () => {
    if (!socket) return alert("socket is not connected");
    socket.emit(BASEBALL_EMIT_EVENTS.APPROVE_RANDOM_MATCH);
    setIsPending(true);
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
        cancelButtonProps={{
          hidden: true,
        }}
      >
        <div className="main-random-matching-dialog-inner">
          <PacmanLoader color={colors.grey[100]} />
          <p>상대를 찾고있습니다.</p>
          <Button onClick={() => setIsMatching(false)}>매칭 취소하기</Button>
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
        onCancel={() => setIsMatched(false)}
      >
        <div>매칭이 완료되었습니다.</div>
        <div>상대 정보</div>
        <div>은광</div>
        <div>20전 10승 10패 (50%)</div>
      </Modal>
    </MainComponentBlock>
  );
};

export default MainComponent;
