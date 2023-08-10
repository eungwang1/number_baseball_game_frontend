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
import { Alert, Button, Dialog, Snackbar, TextField } from "@mui/material";

const BaseBallComponentBlock = styled.div`
  padding: 30px 0;
`;

interface BaseBallComponentProps {}

const BaseBallComponent: React.FC<BaseBallComponentProps> = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [myBaseballNumber, setMyBaseballNumber] = useState<string>("");
  const [isRegisterNumber, setIsRegisterNumber] = useState<boolean>(false);
  const [isGameStart, setIsGameStart] = useState<boolean>(false);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true);
  const [guessNumber, setGuessNumber] = useState<string>("");
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [myGuessResults, setMyGuessResults] = useState<
    BaseballGuessResultResponse[]
  >([]);
  const [opponentGuessResults, setOpponentGuessResults] = useState<
    BaseballGuessResultResponse[]
  >([]);

  const socket = useSocket(`http://localhost:80/baseball/${id}`);

  useEffect(() => {
    if (socket) {
      socket.on(BASEBALL_GAME_SUBSCRIBE_EVENTS.CONNECTED, () => {
        setIsConnected(true);
      });
      socket.on(
        BASEBALL_GAME_SUBSCRIBE_EVENTS.ERROR,
        (data: BaseballErrorResponse) => {
          setErrorMessage(data.message);
          if (data.statusCode > 400) {
            setTimeout(() => {
              router.push("/");
            }, 2000);
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
            setIsWin(true);
          }
          setIsGameEnd(true);
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
          setMyGuessResults((prev) => [...prev, data]);
        }
      );
      socket.on(
        BASEBALL_GAME_SUBSCRIBE_EVENTS.OPPONENT_GUESS_RESULT,
        (data: BaseballGuessResultResponse) => {
          setOpponentGuessResults((prev) => [...prev, data]);
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

  const handleRegisterNumber = () => {
    socket?.emit(BASEBALL_GAME_EMIT_EVENTS.SET_BALL_NUMBER, {
      baseballNumber: myBaseballNumber,
    });
    setIsRegisterNumber(true);
  };

  const onChagneRegisterNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 4) return;
    if (isNaN(Number(e.target.value))) return;
    setMyBaseballNumber(e.target.value);
  };
  const onChangeGuessNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 4) return;
    if (isNaN(Number(e.target.value))) return;
    setGuessNumber(e.target.value);
  };
  const handleGuessBallNumber = () => {
    if (!socket || guessNumber.length !== 4) return;
    socket.emit(BASEBALL_GAME_EMIT_EVENTS.GUESS_BALL_NUMBER, {
      baseballNumber: guessNumber,
    });
  };

  if (!isConnected) return <div>로딩중...</div>;
  return (
    <BaseBallComponentBlock>
      <TextField
        label="야구 숫자"
        variant="outlined"
        value={guessNumber}
        onChange={onChangeGuessNumber}
        placeholder="숫자를 입력해주세요."
        size="medium"
      />
      <Button
        size="large"
        variant="contained"
        onClick={handleGuessBallNumber}
        disabled={guessNumber.length !== 4}
      >
        입력하기
      </Button>
      <div>내결과</div>
      {myGuessResults.map((result, index) => (
        <div key={index}>
          {result.baseballNumber} : {result.strike}S {result.ball}B
        </div>
      ))}
      <div>상대결과</div>
      {opponentGuessResults.map((result, index) => (
        <div key={index}>
          {result.baseballNumber} : {result.strike}S {result.ball}B
        </div>
      ))}
      <Dialog open={!isMyTurn}>상대차례입니다 !!</Dialog>
      <Dialog open={!isGameStart}>
        {isRegisterNumber ? (
          <div style={{ padding: "30px" }}>상대 기다리는중...</div>
        ) : (
          <div style={{ padding: "30px" }}>
            <TextField
              label="야구 숫자"
              variant="outlined"
              placeholder="숫자를 입력해주세요."
              size="medium"
              value={myBaseballNumber}
              onChange={onChagneRegisterNumber}
            />
            <Button
              size="large"
              variant="contained"
              onClick={handleRegisterNumber}
            >
              등록하기
            </Button>
          </div>
        )}
      </Dialog>
      <Dialog open={isGameEnd}>
        <div style={{ padding: "30px" }}>
          <h1>게임이 종료되었습니다.</h1>
          <div>{`${isWin ? "승리" : "패배"} 하였습니다.`}</div>
        </div>
      </Dialog>
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
