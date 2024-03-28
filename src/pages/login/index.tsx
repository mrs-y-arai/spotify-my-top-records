import { useEffect } from "react";
import { useRouter } from "next/router";

const getClientId = async (): Promise<string | null> => {
  const response = await fetch("/api/spotify/clientId");
  const responseJson = await response.json();
  console.log("responseJson", responseJson);
  return responseJson.clientId;
};

export default function Login() {
  const router = useRouter();
  const redirect_uri = "http://localhost:3000/auth";

  useEffect(() => {
    (async () => {
      const clientId = await getClientId();
      if (clientId) {
        window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`;
        return;
      }

      router.push("/");
    })();
  }, []);

  return (
    <>
      <div>ログイン中</div>
    </>
  );
}
