import { findBaseballGameById } from "@/app/api/baseball/baseballGame";
import BaseballResultComponent from "@/components/baseball/[id]/BaseballResultComponent";

interface BaseballResultPageProps {
  params: {
    id: string;
  };
  searchParams: {
    result: "win" | "lose";
  };
}

export default async function BaseballResultPage({
  searchParams,
  params,
}: BaseballResultPageProps) {
  const baseballGame = await findBaseballGameById(params.id);
  let userNumber: 1 | 2 = 1;
  if (searchParams.result === "win") {
    if (baseballGame.user1_win) userNumber = 1;
    else userNumber = 2;
  }
  if (searchParams.result === "lose") {
    if (baseballGame.user1_win) userNumber = 2;
    else userNumber = 1;
  }
  return (
    <BaseballResultComponent
      baseballGame={baseballGame}
      userNumber={userNumber}
    />
  );
}
