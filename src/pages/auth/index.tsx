import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLoadingState } from "~/hooks/useLoadingState";

export default function Auth() {
  const router = useRouter();
  const { addLoadingKey, removeLoadingKey } = useLoadingState();

  /**
   * アクセストークンを取得する
   * 取得したら、APIを叩いてAPI側でクッキーにセットしてもらう
   */
  const getAccessToken = async (authCode: string) => {
    const response = await fetch(
      `/api/spotify/auth/generate?code=${authCode}`,
      {
        method: "GET",
      }
    );
    const responseJson = await response.json();

    await fetch("/api/spotify/auth", {
      method: "POST",
      body: new URLSearchParams({
        accessToken: responseJson.data.access_token,
        expiresIn: responseJson.data.expires_in,
        refreshToken: responseJson.data.refresh_token,
      }),
    });
  };

  useEffect(() => {
    (async () => {
      addLoadingKey("auth");
      const authCode = router.query.code ? String(router.query.code) : null;
      if (authCode) {
        await getAccessToken(authCode);
        router.push("/");
      }
      removeLoadingKey("auth");
    })();
  }, [router.query]);

  return (
    <>
      <div>Spotify 認証情報取得中</div>
    </>
  );
}
