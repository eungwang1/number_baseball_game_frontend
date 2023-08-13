import BaseballResultComponent from "@/components/baseball/[id]/BaseballResultComponent";

export default function BaseballLose() {
  return (
    <BaseballResultComponent
      gameResult={{
        isWin: false,
      }}
    />
  );
}
