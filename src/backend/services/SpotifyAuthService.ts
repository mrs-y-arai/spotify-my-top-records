import { resetCookie } from "~/backend/utils";
import type { NextApiResponse } from "next";

type SpotifyAuth = {
  accessToken: string | null;
  expiresIn: number | null;
  refreshToken: string | null;
};

/**
 * すでに認証情報がある場合、このクラスのインスタンス生成時に、初期値にセットする
 * MEMO: NextApiResponseと密になっているのが気になる。
 */
export class SpotifyAuthService {
  private _accessToken: SpotifyAuth["accessToken"] = null;
  private _expires_in: SpotifyAuth["expiresIn"] = null;
  private _refreshToken: SpotifyAuth["refreshToken"] = null;
  private _nextApiResponse: NextApiResponse;

  constructor(nextApiResponse: NextApiResponse) {
    this._nextApiResponse = nextApiResponse;
  }

  get accessToken(): SpotifyAuth["accessToken"] {
    return this._accessToken;
  }

  get expiresIn(): SpotifyAuth["expiresIn"] {
    return this._expires_in;
  }

  get refreshToken(): SpotifyAuth["refreshToken"] {
    return this._refreshToken;
  }

  /**
   * 認証情報をオブジェクトで取得する
   */
  get spotifyAuth(): SpotifyAuth {
    return {
      accessToken: this._accessToken,
      expiresIn: this._expires_in,
      refreshToken: this._refreshToken,
    };
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
   * Spotify認証情報を更新する
   */
  private _updateSpotifyAuth(params: SpotifyAuth) {
    this._accessToken = params.accessToken;
    this._expires_in = params.expiresIn;
    this._refreshToken = params.refreshToken;

    if (params.accessToken && params.expiresIn && params.refreshToken) {
      this.setSpotifyAuthCookie(
        params.accessToken,
        params.expiresIn,
        params.refreshToken
      );
    }
    this._resetAuthCookie();
  }

  /**
   * リフレッシュトークンから、アクセストークンを取得する
   */
  async getSpotifyAuthFromRefreshToken() {
    const endpointUrl = `${process.env.NEXT_PUBLIC_SPOTIFY_ENDPOINT_BASE_URL}/token`;
    const clientId = process.env.SPOTIFY_CLIENT_ID;

    if (!clientId || !this._refreshToken) {
      throw new Error("Client Credential not found");
    }

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this._refreshToken,
        client_id: clientId,
      }),
    });
    const responseJson = await response.json();

    this._updateSpotifyAuth({
      accessToken: responseJson.access_token,
      expiresIn: responseJson.expires_in,
      refreshToken: responseJson.refresh_token,
    });

    return this.spotifyAuth;
  }

  /**
   * クッキーに保存された、spotifyAuthTokenをクリアする
   */
  private _resetAuthCookie(): void {
    resetCookie(this._nextApiResponse, "spotifyAuthToken");
  }

  /**
   * 認証情報をリセットする
   */
  resetAuth(): void {
    this._accessToken = null;
    this._expires_in = null;
    this._refreshToken = null;

    this._resetAuthCookie();
  }
}
