import { resetCookie } from "~/backend/utils";
import type { NextApiResponse } from "next";

/**
 * すでに認証情報がある場合、このクラスのインスタンス生成時に、初期値にセットする
 * MEMO: NextApiResponseと密になっているのが気になる。
 */
export class SpotifyAuthService {
  private _nextApiResponse: NextApiResponse;

  constructor(nextApiResponse: NextApiResponse) {
    this._nextApiResponse = nextApiResponse;
  }

  /**
   * Spotify認証情報をクッキーにセットする
   */
  setSpotifyAuthCookie(
    accessToken: string,
    expiresIn: number,
    refreshToken: string
  ): void {
    this._nextApiResponse.setHeader("Set-Cookie", [
      `spotifyAuthToken=${accessToken}; HttpOnly; Max-Age=${expiresIn};`,
      `spotifyRefreshToken=${refreshToken}; HttpOnly; Max-Age=${expiresIn}`,
    ]);
  }

  /**
   * リフレッシュトークンから、アクセストークンを取得する
   */
  async getSpotifyAuthFromRefreshToken(refreshToken: string) {
    const endpointUrl = `${process.env.NEXT_PUBLIC_SPOTIFY_ACCOUNTS_ENDPOINT_BASE_URL}/token`;
    const clientId = process.env.SPOTIFY_CLIENT_ID;

    if (!clientId) {
      throw new Error("Client Credential not found");
    }

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    });
    const responseJson = await response.json();

    return {
      accessToken: responseJson.access_token,
      expiresIn: responseJson.expires_in,
      refreshToken: responseJson.refresh_token,
    };
  }

  /**
   * 認証情報をリセットする
   */
  resetAuth(): void {
    resetCookie(this._nextApiResponse, "spotifyAuthToken");
  }
}
