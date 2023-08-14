"use client";

import { Button, Result, message } from "antd";
import { FrownOutlined, TrophyOutlined } from "@ant-design/icons";
import React from "react";
import { BaseballGameResult } from "../baseball.type";
import { BaseballGame } from "@/app/api/baseball/baseballGame.type";
import BaseballGameHistory from "./BaseballGameHistory";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BaseballResultComponentProps {
  userNumber?: 1 | 2;
  baseballGame: BaseballGame;
}

const BaseballResultComponent: React.FC<BaseballResultComponentProps> = ({
  userNumber,
  baseballGame,
}) => {
  const router = useRouter();
  if (!userNumber) {
    message.error("잘못된 접근입니다.");
    router.push("/");
    return null;
  }
  const isWin = baseballGame[`user${userNumber}_win`];
  return (
    <>
      <Result
        status="success"
        icon={isWin ? <TrophyOutlined /> : <FrownOutlined />}
        title={isWin ? "승리 !" : "패배 !"}
        subTitle={isWin ? "당신은 승리하였습니다." : "당신은 패배하였습니다."}
        extra={[
          <Link href="/" key="home-link">
            <Button
              size="large"
              type="primary"
              key="home-button"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              홈으로
            </Button>
          </Link>,
          <BaseballGameHistory
            key="baseball-game-history"
            gameHistory={{
              me: baseballGame[`user${userNumber}_baseball_number_history`],
              opponent:
                baseballGame[
                  `user${userNumber === 1 ? 2 : 1}_baseball_number_history`
                ],
            }}
          />,
        ]}
      />
    </>
  );
};

export default BaseballResultComponent;
