import type { NextApiRequest, NextApiResponse } from "next";

type Response = {
  clientId?: string;
  message?: string;
};

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    return res.status(404).json({ message: "Client ID not found" });
  }

  res.status(200).json({ clientId });
}
