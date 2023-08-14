import { notFound } from "next/navigation";
import { BaseballGame } from "./baseballGame.type";
import "server-only";

export async function findBaseballGameById(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/baseball-game?id=${id}`
  );

  const baseballGame = (await res.json()) as BaseballGame;

  if (!baseballGame) {
    notFound();
  }

  return baseballGame;
}
