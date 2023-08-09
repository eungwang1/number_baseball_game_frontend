"use client";

import useSocket from "@/libs/hooks/useSocket";
import { Button, Dialog } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MatchedResponse } from "./main.type";

const MainComponentBlock = styled.div`
  padding: 10px;
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

interface MainComponentProps {}

const MainComponent: React.FC<MainComponentProps> = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchedData, setMatchedData] = useState<MatchedResponse | null>(null);
  const router = useRouter();
  const socket = useSocket("http://localhost:80");
  useEffect(() => {
    if (socket) {
      socket.on("matched", (data: MatchedResponse) => {
        setIsMatching(false);
        setMatchedData(data);
        setTimeout(() => {
          router.push(`/baseball/${data.roomId}`);
        }, 2000);
      });
    }
  }, [socket]);

  const handleRandomMatch = () => {
    if (!socket) return alert("socket is not connected");
    socket.emit("requestRandomMatch");
    setIsMatching(true);
  };
  return (
    <MainComponentBlock>
      <div className="main-button-wrapper">
        <Button
          onClick={handleRandomMatch}
          className="main-random-matching-button"
          size="large"
          variant="contained"
        >
          랜덤매칭
        </Button>
      </div>
      <Dialog
        open={isMatching}
        onClose={() => {
          if (!socket) return alert("socket is not connected");
          setIsMatching(false);
          socket?.emit("cancelRandomMatch");
          alert("매칭 취소");
        }}
      >
        <div>매칭중...</div>
      </Dialog>
      <Dialog
        open={!!matchedData}
        onClose={() => {
          setMatchedData(null);
          router.push(`/baseball/${matchedData?.roomId}`);
        }}
      >
        <div>매칭이 완료되었습니다.</div>
        <div>{`나의정보 : ${matchedData?.me.socketId}`}</div>
        <div>{`상대방정보 : ${matchedData?.opponent.socketId}`}</div>
      </Dialog>
    </MainComponentBlock>
  );
};

export default MainComponent;
