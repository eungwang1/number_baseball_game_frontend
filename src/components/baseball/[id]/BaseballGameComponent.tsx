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
import { colors } from "@mui/material";
import { Input, Button, message, Spin } from "antd";
import NumberRegistrationModal from "./NumberRegistrationModal";
import BaseballGameHistory from "./BaseballGameHistory";
import useTimer from "@/libs/hooks/useTimer";
import { ClockLoader } from "react-spinners";

interface BaseBallComponentBlockProps {
  currentTurnTime: number;
  isTimerActive: boolean;
}

const BaseBallComponentBlock = styled.div<BaseBallComponentBlockProps>`
  padding: 30px 0;
  position: relative;
  height: 100vh;
  .baseball-game-history-wrapper {
    margin-top: 20px;
  }

  .baseball-timer-indicator {
    margin-left: auto;
    font-size: 14px;
    color: ${(props) =>
      props.currentTurnTime < 10
        ? colors.red[500]
        : props.isTimerActive
        ? colors.blue[400]
        : colors.grey[400]};
    font-weight: bold;
  }

  .baseball-waiting-turn-indicator {
    padding: 0px 11px;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 1.5;
    border: 1px solid ${colors.grey[300]};
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 14px;
    color: ${colors.grey[400]};
    font-weight: bold;
    width: 100%;
    height: 42px;
  }
  .number-button-box {
    width: 270px;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    transform: translateX(-50%);
    left: 50%;
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
  .number-top-button-wrapper {
    display: flex;
    width: 100%;
    gap: 5px;
  }
  .number-display-wrapper {
    display: flex;
    width: 100%;
    gap: 5px;
    height: 42px;
    input {
      text-align: center;
      color: ${colors.grey[700]};
      font-size: 20px;
      font-weight: bold;
    }
  }
  .baseball-timer-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    gap: 6px;
    height: 24px;
  }
  .baseball-timer-value {
    position: relative;
    top: 1px;
    color: ${(props) =>
      props.currentTurnTime < 10
        ? colors.red[500]
        : props.isTimerActive
        ? colors.blue[400]
        : colors.grey[400]};
  }
`;

interface BaseBallComponentProps {
  turnTimeLimit: number;
}

const BaseBallComponent: React.FC<BaseBallComponentProps> = ({
  turnTimeLimit,
}) => {
  const { id } = useParams();
  const router = useRouter();
  const [number, setNumber] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isGameStart, setIsGameStart] = useState<boolean>(false);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true);

  const { time, isTimerActive, pauseTime, resetTime, startTime } =
    useTimer(turnTimeLimit);

  const [myGuessResults, setMyGuessResults] = useState<
    BaseballGuessResultResponse[]
  >([]);
  const [opponentGuessResults, setOpponentGuessResults] = useState<
    BaseballGuessResultResponse[]
  >([]);

  const socket = useSocket(`${process.env.NEXT_PUBLIC_API_URL}/baseball/${id}`);

  const onClickNumberButton = (value: string) => {
    if (number.length >= 4) return;
    const isUnique = !number.includes(value);
    if (!isUnique) return message.error("중복된 숫자는 입력할 수 없습니다.");
    setNumber((prev) => prev + value);
  };
  const handleRemoveNumber = () => {
    setNumber((prev) => prev.slice(0, prev.length - 1));
  };
  const handleRegisterNumber = (baseballNumber: string) => {
    if (!socket) return message.error("연결 상태를 확인해주세요.");
    if (baseballNumber.length !== 4)
      return message.error("4자리 숫자를 입력해주세요.");
    const baseballNumberArray = baseballNumber.split("");
    const isNumber = baseballNumberArray.every((n) => !isNaN(parseInt(n)));
    if (!isNumber) return message.error("숫자만 입력해야 합니다.");
    const isUnique = new Set(baseballNumberArray).size === 4;
    if (!isUnique) return message.error("숫자는 중복되지 않아야 합니다.");
    if (!isGameStart) {
      // 게임 시작 전, 볼넘버 설정
      socket.emit(BASEBALL_GAME_EMIT_EVENTS.SET_BALL_NUMBER, {
        baseballNumber,
      });
    } else {
      // 게임 시작 후, 볼넘버 추측
      if (!isMyTurn) return message.error("상대방의 차례입니다.");
      socket.emit(BASEBALL_GAME_EMIT_EVENTS.GUESS_BALL_NUMBER, {
        baseballNumber,
      });
    }
    setNumber("");
  };
  const generateRandomBaseballNumber = () => {
    let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let result = "";
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      result += numbers[randomIndex];
      numbers.splice(randomIndex, 1);
    }
    return result;
  };

  const handleSetRandomNumber = () => {
    const generatedNumber = generateRandomBaseballNumber();
    setNumber(generatedNumber);
  };

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
          pauseTime();
          resetTime();
          startTime();
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

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        setNumber((prev) => prev.slice(0, prev.length - 1));
      }
      if (e.key === "Enter") {
        handleRegisterNumber(number);
      }
      if (e.key >= "0" && e.key <= "9") {
        onClickNumberButton(e.key);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [number]);

  useEffect(() => {
    if (time === 0) {
      pauseTime();
      resetTime();
      if (isMyTurn) {
        message.error("시간이 초과되었습니다.");
        const generatedNumber = generateRandomBaseballNumber();
        handleRegisterNumber(generatedNumber);
      }
    }
  }, [time]);

  if (!isConnected) return <Spin />;
  return (
    <BaseBallComponentBlock
      currentTurnTime={time}
      isTimerActive={isTimerActive}
    >
      <BaseballGameHistory
        gameHistory={{
          me: myGuessResults,
          opponent: opponentGuessResults,
        }}
      />
      <div className="number-button-box">
        <div className="baseball-timer-wrapper">
          <ClockLoader
            loading={isTimerActive}
            color={time < 10 ? colors.red[500] : colors.blue[400]}
            size={20}
          />
          {isTimerActive && (
            <div className="baseball-timer-value">
              {time.toString().padStart(2, "0")}
            </div>
          )}
        </div>
        {isMyTurn ? (
          <div className="number-display-wrapper">
            {[0, 1, 2, 3].map((value) => (
              <Input key={value} value={number.charAt(value) || "?"} readOnly />
            ))}
          </div>
        ) : (
          <div className="baseball-waiting-turn-indicator">
            <div>
              <Spin />
            </div>
            <div>상대방의 차례입니다.</div>
          </div>
        )}
        <div className="number-top-button-wrapper">
          <Button
            className="number-backspace-button"
            size="large"
            disabled={!isMyTurn}
            onClick={handleRemoveNumber}
          >
            <ArrowBackIcon />
          </Button>
          <Button
            className="number-backspace-button"
            size="large"
            disabled={!isMyTurn}
            onClick={handleSetRandomNumber}
          >
            랜덤숫자
          </Button>
          <Button
            className="number-register-button"
            size="large"
            disabled={!isMyTurn}
            onClick={() => handleRegisterNumber(number)}
          >
            입력하기
          </Button>
        </div>
        <div className="number-button-wrapper">
          {Array.from({ length: 5 }, (_, index) => String(index)).map(
            (value) => (
              <Button
                size="large"
                type="primary"
                key={value}
                disabled={!isMyTurn || number.includes(value)}
                onClick={() => onClickNumberButton(value)}
              >
                {value}
              </Button>
            )
          )}
        </div>
        <div className="number-button-wrapper">
          {Array.from({ length: 5 }, (_, index) => String(index + 5)).map(
            (value) => (
              <Button
                size="large"
                type="primary"
                key={value}
                disabled={!isMyTurn || number.includes(value)}
                onClick={() => onClickNumberButton(value)}
              >
                {value}
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
