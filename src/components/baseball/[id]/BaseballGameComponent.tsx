"use client";

import useSocket from "@/libs/hooks/useSocket";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BASEBALL_GAME_EMIT_EVENTS,
  BASEBALL_GAME_SUBSCRIBE_EVENTS,
} from "../baseball.constants";
import {
  BaseballChangeTurnResponse,
  BaseballErrorResponse,
  BaseballGameEndResponse,
  BaseballGameStartResponse,
  BaseballGuessResultResponse,
} from "../baseball.type";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Snackbar, colors } from "@mui/material";
import { Input, Button, message } from "antd";
import NumberRegistrationModal from "./NumberRegistrationModal";
import WaitingTurnModal from "./WaitingTurnModal";

const BaseBallComponentBlock = styled.div`
  padding: 30px 0;
  position: relative;
  height: 100vh;
  .baseball-number-record-box {
    margin-top: 20px;
    border-radius: 10px;
    border: 1px solid ${colors.grey[300]};
  }
  .baseball-number-record-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    border-radius: 10px 10px 0 0;
    background-color: ${colors.grey[50]};
    div {
      width: 100%;
      color: ${colors.grey[600]};
      text-align: center;
    }
    div:nth-child(1) {
      border-right: 1px solid ${colors.grey[300]};
    }
  }
  .baseball-number-record-list {
    display: flex;
    height: 200px;
    overflow-y: auto;
    div {
      width: 100%;
      text-align: center;
    }
  }
  .baseball-number-record-list-item {
    padding: 10px 0;

    border-bottom: 1px solid ${colors.grey[200]};
  }
  .number-button-box {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(100% - 32px);
    gap: 5px;
    bottom: 20px;
    z-index: 9999;
  }
  .number-button-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    button {
      width: 50px;
      height: 50px;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .number-backspace-button,
  .number-register-button {
    font-weight: bold;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 270px;
  }
  .guess-button {
    margin-top: 10px;
    width: 100%;
  }
`;

interface BaseBallComponentProps {}

const BaseBallComponent: React.FC<BaseBallComponentProps> = () => {
  const { id } = useParams();
  const router = useRouter();
  const [number, setNumber] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isGameStart, setIsGameStart] = useState<boolean>(false);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [myGuessResults, setMyGuessResults] = useState<
    BaseballGuessResultResponse[]
  >([]);
  const [opponentGuessResults, setOpponentGuessResults] = useState<
    BaseballGuessResultResponse[]
  >([]);

  const socket = useSocket(`${process.env.NEXT_PUBLIC_API_URL}/baseball/${id}`);

  useEffect(() => {
    if (socket) {
      socket.on(BASEBALL_GAME_SUBSCRIBE_EVENTS.CONNECTED, () => {
        setIsConnected(true);
      });
      socket.on(
        BASEBALL_GAME_SUBSCRIBE_EVENTS.ERROR,
        (data: BaseballErrorResponse) => {
          message.error(data.message);
          // if (data.statusCode > 400) {
          //   setTimeout(() => {
          //     router.push("/");
          //   }, 2000);
          // }
        }
      );

      socket.on(
        BASEBALL_GAME_SUBSCRIBE_EVENTS.GAME_START,
        (data: BaseballGameStartResponse) => {
          setIsGameStart(true);
        }
      );
      socket.on(
        BASEBALL_GAME_SUBSCRIBE_EVENTS.GAME_END,
        (data: BaseballGameEndResponse) => {
          if (data.isWin) {
            return router.push(`/baseball/${id}/win`);
          }
          return router.push(`/baseball/${id}/lose`);
        }
      );

      socket.on(
        BASEBALL_GAME_SUBSCRIBE_EVENTS.CHANGE_TURN,
        (data: BaseballChangeTurnResponse) => {
          setIsMyTurn(data.turn === socket.id);
        }
      );
      socket.on(
        BASEBALL_GAME_SUBSCRIBE_EVENTS.GUESS_RESULT,
        (data: BaseballGuessResultResponse) => {
          setMyGuessResults((prev) => [data, ...prev]);
        }
      );
      socket.on(
        BASEBALL_GAME_SUBSCRIBE_EVENTS.OPPONENT_GUESS_RESULT,
        (data: BaseballGuessResultResponse) => {
          setOpponentGuessResults((prev) => [data, ...prev]);
        }
      );
    }

    return () => {
      if (socket) {
        socket.off(BASEBALL_GAME_SUBSCRIBE_EVENTS.ERROR);
        socket.off(BASEBALL_GAME_SUBSCRIBE_EVENTS.GAME_START);
        socket.off(BASEBALL_GAME_SUBSCRIBE_EVENTS.GAME_END);
        socket.off(BASEBALL_GAME_SUBSCRIBE_EVENTS.CHANGE_TURN);
        socket.off(BASEBALL_GAME_SUBSCRIBE_EVENTS.GUESS_RESULT);
        socket.off(BASEBALL_GAME_SUBSCRIBE_EVENTS.OPPONENT_GUESS_RESULT);
      }
    };
  }, [socket]);

  const onClickNumberButton = (value: string) => {
    if (number.length >= 4)
      return message.error("숫자는 4자리까지만 입력할 수 있습니다.");
    const isUnique = !number.includes(value);
    if (!isUnique) return message.error("중복된 숫자는 입력할 수 없습니다.");
    setNumber((prev) => prev + value);
  };
  const handleRemoveNumber = () => {
    setNumber((prev) => prev.slice(0, prev.length - 1));
  };
  const handleRegisterNumber = () => {
    if (!socket) return message.error("연결 상태를 확인해주세요.");
    if (number.length !== 4) return message.error("4자리 숫자를 입력해주세요.");
    const baseballNumberArray = number.split("");
    const isNumber = baseballNumberArray.every((n) => !isNaN(parseInt(n)));
    if (!isNumber) return message.error("숫자만 입력해야 합니다.");
    const isUnique = new Set(baseballNumberArray).size === 4;
    if (!isUnique) return message.error("숫자는 중복되지 않아야 합니다.");
    if (!isGameStart) {
      // 게임 시작 전, 볼넘버 설정
      socket.emit(BASEBALL_GAME_EMIT_EVENTS.SET_BALL_NUMBER, {
        baseballNumber: number,
      });
    } else {
      // 게임 시작 후, 볼넘버 추측
      socket.emit(BASEBALL_GAME_EMIT_EVENTS.GUESS_BALL_NUMBER, {
        baseballNumber: number,
      });
    }
    setNumber("");
  };
  if (!isConnected) return <div>로딩중...</div>;
  return (
    <BaseBallComponentBlock>
      <Input
        value={isGameStart ? number : ""}
        placeholder="4자리 숫자를 입력해주세요."
        inputMode="none"
        size="large"
      />
      <div className="baseball-number-record-box">
        <div className="baseball-number-record-header">
          <div>내기록</div>
          <div>상대기록</div>
        </div>
        <div className="baseball-number-record-list">
          <div>
            {myGuessResults.map((result, index) => (
              <div className="baseball-number-record-list-item" key={index}>
                {result.baseballNumber} : {result.strike}S {result.ball}B
              </div>
            ))}
          </div>
          <div>
            {opponentGuessResults.map((result, index) => (
              <div className="baseball-number-record-list-item" key={index}>
                {result.baseballNumber} : {result.strike}S {result.ball}B
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="number-button-box">
        <Button
          className="number-backspace-button"
          size="large"
          onClick={handleRemoveNumber}
        >
          <ArrowBackIcon />
        </Button>
        <Button
          className="number-register-button"
          size="large"
          onClick={handleRegisterNumber}
        >
          입력하기
        </Button>
        <div className="number-button-wrapper">
          {Array.from({ length: 5 }, (_, index) => String(index)).map(
            (number) => (
              <Button
                size="large"
                type="primary"
                key={number}
                onClick={() => onClickNumberButton(number)}
              >
                {number}
              </Button>
            )
          )}
        </div>
        <div className="number-button-wrapper">
          {Array.from({ length: 5 }, (_, index) => String(index + 5)).map(
            (number) => (
              <Button
                size="large"
                type="primary"
                key={number}
                onClick={() => onClickNumberButton(number)}
              >
                {number}
              </Button>
            )
          )}
        </div>
      </div>

      <WaitingTurnModal open={!isMyTurn} footer={null} closeIcon={null} />
      <NumberRegistrationModal
        open={!isGameStart}
        closeIcon={false}
        footer={false}
        socket={socket}
        number={number}
        setNumber={setNumber}
      />

      {/* <Dialog open={isGameEnd}>
        <div style={{ padding: "30px" }}>
          <h1>게임이 종료되었습니다.</h1>
          <div>{`${isWin ? "승리" : "패배"} 하였습니다.`}</div>
        </div>
      </Dialog> */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
      >
        <Alert severity="error" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </BaseBallComponentBlock>
  );
};

export default BaseBallComponent;
