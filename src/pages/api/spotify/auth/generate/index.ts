import type { NextApiRequest, NextApiResponse } from "next";

type Response = {
  message?: string;
  data?: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope?: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const authCode = req.query.code ? String(req.query.code) : null;

  if (!clientId || !clientSecret || !authCode) {
    return res.status(404).json({ message: "Client Credential not found" });
  }

  // base64にエンコード
  const base64Client = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${base64Client}`,
    },
    method: "POST",
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: "http://localhost:3000/auth",
    }),
  });
  const responseJson: Response["data"] = await response.json();

  res.status(200).json({
    data: responseJson,
  });
}
