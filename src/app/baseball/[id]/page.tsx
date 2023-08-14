import BaseBallComponent from "@/components/baseball/[id]/BaseballGameComponent";

interface BaseballPageProps {
  searchParams: {
    turnTimeLimit: string;
  };
}

export default function BaseballPage({ searchParams }: BaseballPageProps) {
  const turnTimeLimit = Number(searchParams.turnTimeLimit);
  return <BaseBallComponent turnTimeLimit={turnTimeLimit} />;
}
