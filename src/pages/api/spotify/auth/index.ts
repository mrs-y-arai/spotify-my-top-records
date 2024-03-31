import type { NextApiRequest, NextApiResponse } from "next";
import { SpotifyAuthService } from "~/backend/services/SpotifyAuthService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getHandler(req, res);
  }

  if (req.method === "POST") {
    postHandler(req, res);
  }

  return res.status(405).json({
    message: "Method Not Allowed",
  });
}

type GetResponse = {
  data?: {
    accessToken: string;
  };
  message?: string;
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetResponse>
) => {
  // クッキーから認証情報を取得
  const spotifyAuthCookie = req.cookies.spotifyAuthToken;

  // クッキーに認証情報がある場合、そのまま返す
  if (spotifyAuthCookie) {
    return res.status(200).json({
      data: {
        accessToken: spotifyAuthCookie,
      },
    });
  }

  // SpotifyAuthServiceを初期化
  const spotifyAuth = new SpotifyAuthService(res);

  // アクセストークンがない場合、リフレッシュトークンを使って新しいアクセストークンを取得
  // リフレッシュトークンもない場合は、エラーを返す
  // TODO: エラーハンドリングちゃんとする
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("Refresh Token not found");
    }

    const newSpotifyAuth = await spotifyAuth.getSpotifyAuthFromRefreshToken(
      refreshToken
    );

    if (
      !newSpotifyAuth.accessToken ||
      !newSpotifyAuth.expiresIn ||
      !newSpotifyAuth.refreshToken
    ) {
      throw new Error("Failed to get Spotify Auth");
    }

    return res.status(200).json({
      data: {
        accessToken: newSpotifyAuth.accessToken,
      },
    });
  } catch (e) {
    // 失敗したら、アクセストークンをリセットする
    spotifyAuth.resetAuth();

    return res.status(403).json({
      message: "Forbidden",
    });
  }
};

type PostResponse = {
  message?: string;
};

const postHandler = (
  req: NextApiRequest,
  res: NextApiResponse<PostResponse>
) => {
  const accessToken = req.body.accessToken;
  const expiresIn = req.body.expiresIn;
  const refreshToken = req.body.refreshToken;

  console.log("/api/spotify/auth post req.body", req.body);

  // SpotifyAuthServiceを初期化
  const spotifyAuth = new SpotifyAuthService(res);

  try {
    spotifyAuth.setSpotifyAuthCookie(accessToken, expiresIn, refreshToken);
    return res.status(200).json({
      message: "Success",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
