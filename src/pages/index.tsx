import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);

  /**
   * Spotifyに認証されている状態か確認する
   */
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/spotify/auth", {
        method: "GET",
      });

      if (!response.ok) throw new Error("ログインされておりません。");

      const responseJson = await response.json();
      console.log("checkAuth responseJson", responseJson);
      setIsLogin(() => true);
    } catch (e) {
      console.error(e);
      setIsLogin(() => false);
    }
  };

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);

  return (
    <>
      <div>
        <div className="mb-20">
          {isLogin ? (
            <>
              <p>Spotifyログイン中</p>
            </>
          ) : (
            <>
              <Button className="mb-4" onClick={() => router.push("/login")}>
                Spotifyログインをする
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
