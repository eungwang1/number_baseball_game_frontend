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
import { Input, Button, message, Spin } from "antd";
import NumberRegistrationModal from "./NumberRegistrationModal";
import BaseballGameHistory from "./BaseballGameHistory";

const BaseBallComponentBlock = styled.div`
  padding: 30px 0;
  position: relative;
  height: 100vh;
  .baseball-game-history-wrapper {
    margin-top: 20px;
  }

  .baseball-waiting-turn-indicator {
    padding: 7px 11px;
    font-size: 16px;
    line-height: 1.5;
    border: 1px solid ${colors.grey[300]};
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 15px;
    color: ${colors.grey[500]};
    font-weight: bold;
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
          if (data.redirectPath) {
            setTimeout(() => {
              if (data.redirectPath) router.push(data.redirectPath);
            }, 1500);
          }
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
            return router.push(`/baseball/${id}/result?result=win`);
          }
          return router.push(`/baseball/${id}/result?result=lose`);
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
      if (!isMyTurn) return message.error("상대방의 차례입니다.");
      socket.emit(BASEBALL_GAME_EMIT_EVENTS.GUESS_BALL_NUMBER, {
        baseballNumber: number,
      });
    }
    setNumber("");
  };

  if (!isConnected) return <div>로딩중...</div>;
  return (
    <BaseBallComponentBlock>
      {isMyTurn ? (
        <Input
          value={isGameStart ? number : ""}
          placeholder="4자리 숫자를 입력해주세요."
          inputMode="none"
          size="large"
          readOnly
        />
      ) : (
        <div className="baseball-waiting-turn-indicator">
          <div>
            <Spin />
          </div>
          <div>상대방의 차례입니다.</div>
        </div>
      )}

      <div className="baseball-game-history-wrapper">
        <BaseballGameHistory
          gameHistory={{
            me: myGuessResults,
            opponent: opponentGuessResults,
          }}
        />
      </div>
      <div className="number-button-box">
        <Button
          className="number-backspace-button"
          size="large"
          disabled={!isMyTurn}
          onClick={handleRemoveNumber}
        >
          <ArrowBackIcon />
        </Button>
        <Button
          className="number-register-button"
          size="large"
          disabled={!isMyTurn}
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
                disabled={!isMyTurn}
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
                disabled={!isMyTurn}
                onClick={() => onClickNumberButton(number)}
              >
                {number}
              </Button>
            )
          )}
        </div>
      </div>

      <NumberRegistrationModal
        open={!isGameStart}
        closeIcon={false}
        footer={false}
        socket={socket}
        number={number}
        setNumber={setNumber}
      />
    </BaseBallComponentBlock>
  );
};

export default BaseBallComponent;
