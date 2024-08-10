import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const firstTrack = searchParams.has("first")
    ? searchParams.get("first")
    : null;
  const secondTrack = searchParams.has("second")
    ? searchParams.get("second")
    : null;
  const thirdTrack = searchParams.has("third")
    ? searchParams.get("third")
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "white",
          background: "black",
          width: "100%",
          height: "100%",
          padding: "50px",
          textAlign: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
        tw="border border-sky-500 border-width[3px]"
      >
        <p tw="font-bold mb-4">私が最近聴いた曲ランキング</p>
        {firstTrack && <p tw="text-4xl mb-1">1位: {firstTrack}</p>}
        {secondTrack && <p tw="text-3xl mb-1">2位: {secondTrack}</p>}
        {thirdTrack && <p tw="text-2xl mb-1">3位: {thirdTrack}</p>}
        <p tw="font-bold text-3xl">
          サイトにアクセスしてあなたの再生ランキングもチェック！
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
