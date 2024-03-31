import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTopTracks } from "~/hooks/useTopTracks";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { getTopTracks, topTracks } = useTopTracks();

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
        <div className="mb-20 text-center">
          {isLogin ? (
            <>
              <p className="mb-4">Spotifyログイン中</p>
              <Button className="mb-4" onClick={getTopTracks}>
                get top tracks
              </Button>
              <ul className="max-w-[500px] grid grid-cols-1 gap-7">
                {topTracks &&
                  topTracks.map((track) => (
                    <li className="text-start" key={track.id}>
                      <p>No.{track.id}</p>
                      <p>{track.name}</p>
                      <p>{track.albumName}</p>
                      <p>{track.artistName}</p>
                      <Image
                        width={track.thumbnail.width}
                        height={track.thumbnail.height}
                        src={track.thumbnail.url || ""}
                        alt={track.name}
                      />
                    </li>
                  ))}
              </ul>
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
