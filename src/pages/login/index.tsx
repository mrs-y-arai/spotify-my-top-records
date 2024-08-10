import { useEffect } from "react";
import { useRouter } from "next/router";
import { useLoadingState } from "~/hooks/useLoadingState";

export default function Login() {
  const router = useRouter();
  const { addLoadingKey, removeLoadingKey } = useLoadingState();

  const redirect_uri = "http://localhost:3000/auth";

  const getClientId = async (): Promise<string | null> => {
    const response = await fetch("/api/spotify/clientId");
    const responseJson = await response.json();
    console.log("responseJson", responseJson);
    return responseJson.clientId;
  };
  useEffect(() => {
    (async () => {
      addLoadingKey("login");

      const clientId = await getClientId();
      if (clientId) {
        window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}&scope=user-top-read,`;
        return;
      }

      removeLoadingKey("login");

      router.push("/");
    })();
  }, []);

  return (
    <>
      <div>ログイン処理中</div>
    </>
  );
}
