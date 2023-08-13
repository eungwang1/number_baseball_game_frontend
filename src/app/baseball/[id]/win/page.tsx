import BaseballResultComponent from "@/components/baseball/[id]/BaseballResultComponent";

export default function Baseball() {
  return (
    <BaseballResultComponent
      gameResult={{
        isWin: true,
      }}
    />
  );
}
