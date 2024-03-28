import type { NextApiResponse } from "next";

export const resetCookie = (res: NextApiResponse, cookieName: string): void => {
  res.setHeader(
    "Set-Cookie",
    `${cookieName}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );
};
