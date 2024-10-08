import Link from "next/link";
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

      await response.json();
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

  // useEffect(() => {
  //   if (lineShareButtonRef.current) {
  //     // @ts-ignore
  //     LineIt.loadButton();
  //   }
  // }, [lineShareButtonRef.current]);

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
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      const shareUrl = `https://twitter.com/share?text=私が最近Spotifyで一番再生した曲は、${topTracks[0].name}-${topTracks[0].artistName}です！%0aサイトにアクセスしてあなたの再生ランキングもチェック！%0a&url=${process.env.NEXT_PUBLIC_BASE_URL}`;
                      window.open(shareUrl, "_blank", "noopener noreferrer");
                    }}
                  >
                    Share To X
                  </Button>
                  <Link
                    href={`https://social-plugins.line.me/lineit/share?url=${process.env.NEXT_PUBLIC_BASE_URL}&text=私が最近Spotifyで一番再生した曲は、${topTracks[0].name}-${topTracks[0].artistName}です！サイトにアクセスしてあなたの再生ランキングもチェック！`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="green">Share To LINE</Button>
                  </Link>
                  <script type="text/javascript">LineIt.loadButton();</script>
                </div>
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
