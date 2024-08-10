import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTopTracks } from "~/hooks/useTopTracks";
import TrackList from "~/components/ui/Track/TrackList";
import { useLoadingState } from "~/hooks/useLoadingState";
import SeoMeta from "~/components/layouts/SeoMeta";

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { getTopTracks, topTracks, ogpUrl } = useTopTracks();
  const { addLoadingKey, removeLoadingKey } = useLoadingState();

  /**
   * Spotifyに認証されている状態か確認する
   */
  const checkAuth = async () => {
    addLoadingKey;

    try {
      const response = await fetch("/api/spotify/auth", {
        method: "GET",
      });

      if (!response.ok) throw new Error("ログインされておりません。");

      const responseJson = await response.json();
      console.log("checkAuth responseJson", responseJson);
      setIsLogin(() => true);

      removeLoadingKey;
    } catch (e) {
      setIsLogin(() => false);
      removeLoadingKey;
    }
  };

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);

  return (
    <>
      <SeoMeta pageTitle="TOP" ogpImage={ogpUrl} />
      <div className="text-center">
        <h2 className="text-xl font-bold mb-8">
          あなたの直近1ヶ月のSpotify再生数ランキングを見てみよう！
        </h2>
        {isLogin ? (
          <>
            {!topTracks && (
              <>
                <Button className="mb-4 uppercase" onClick={getTopTracks}>
                  get top tracks
                </Button>
              </>
            )}
            {topTracks && (
              <>
                <TrackList tracks={topTracks} />
                <p className=" capitalize text-lg text-transparent gradient-color bg-clip-text font-bold mb-4">
                  share to your SNS!
                </p>
                <Button
                  onClick={() => {
                    const url = `${process.env.NEXT_PUBLIC_BASE_URL}`;
                    const shareUrl = `https://twitter.com/share?text=私が最近Spotifyで一番再生した曲は、${topTracks[0].name} - ${topTracks[0].artistName}です！%0aサイトにアクセスしてあなたの再生ランキングもチェック！%0a&url=${url}`;
                    window.open(shareUrl, "_blank", "noopener noreferrer");
                  }}
                >
                  Share To X
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Button
              variant="black"
              className="uppercase mb-4"
              onClick={() => router.push("/login")}
            >
              sign in spotify
            </Button>
          </>
        )}
      </div>
    </>
  );
}
