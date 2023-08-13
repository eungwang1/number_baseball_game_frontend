"use client";

import { Button, Result } from "antd";
import { FrownOutlined, TrophyOutlined } from "@ant-design/icons";
import React from "react";
import { BaseballGameResult } from "../baseball.type";

interface BaseballResultComponentProps {
  gameResult: BaseballGameResult;
}

const BaseballResultComponent: React.FC<BaseballResultComponentProps> = ({
  gameResult,
}) => {
  return (
    <Result
      status="success"
      icon={gameResult.isWin ? <TrophyOutlined /> : <FrownOutlined />}
      title={gameResult.isWin ? "승리 !" : "패배 !"}
      subTitle={
        gameResult.isWin ? "당신은 승리하였습니다." : "당신은 패배하였습니다."
      }
      extra={[
        <Button
          size="large"
          type="primary"
          key="console"
          style={{ width: "100%" }}
        >
          홈으로
        </Button>,
      ]}
    />
  );
};

export default BaseballResultComponent;
