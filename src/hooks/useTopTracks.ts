import { useState, useEffect } from "react";
import { TrackItem, TrackList } from "~/models/Track";
import { useLoadingState } from "~/hooks/useLoadingState";

export const useTopTracks = () => {
  const { addLoadingKey, removeLoadingKey } = useLoadingState();

  /**
   * トップトラック
   */
  const [topTracks, setTopTracks] = useState<TrackList | null>(null);

  /**
   * トップトラックを更新する
   */
  const updateTopTracks = (newTopTracks: TrackList) => {
    setTopTracks(() => newTopTracks);
  };

  /**
   * トップトラックを取得する
   */
  const getTopTracks = async () => {
    addLoadingKey("getTopTracks");

    const response = await fetch("/api/spotify/auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();
    const accessToken = responseJson.data.accessToken;

    if (!accessToken) {
      removeLoadingKey("getTopTracks");
      throw new Error("Failed to get access token");
    }

    const endpointUrl = `${process.env.NEXT_PUBLIC_SPOTIFY_ENDPOINT_BASE_URL}/me/top/tracks?type=tracks&limit=5&time_range=short_term&offset=0`;
    const topTracksResponse = await fetch(endpointUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });

    const topTracksResponseJson = await topTracksResponse.json();

    const topTracks: TrackList = topTracksResponseJson.items.map(
      (item: any, index: number): TrackItem => {
        return {
          id: ++index,
          name: item.name,
          thumbnail: {
            url: item.album.images[0].url || null,
            width: item.album.images[0].width || 640,
            height: item.album.images[0].height || 640,
          },
          albumName: item.album.name,
          artistName: item.artists[0].name,
        };
      }
    );

    updateTopTracks(topTracks);
    removeLoadingKey("getTopTracks");
  };

  const [ogpUrl, setOgpUrl] = useState<string>("");

  /**
   * OGP用のURLを生成する
   */
  const _generateOgpUrl = () => {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT_BASE_URL}/og`;

    // windowオブジェクトで、クエリパラメーターを取得する
    const queryParams = new URLSearchParams(window.location.search);

    // クエリパラメーターで、first, second, thirdがあるかどうかを確認する
    const first = queryParams.get("first");
    const second = queryParams.get("second");
    const third = queryParams.get("third");

    if (!first || !second || !third) return;

    // const searchParams = new URLSearchParams({
    //   first: topTracks[0].name || "",
    //   second: topTracks[1].name || "",
    //   third: topTracks[2].name || "",
    // });
    const _ogpUrl = `${baseUrl}?${queryParams.toString()}`;

    setOgpUrl(() => _ogpUrl);
  };

  useEffect(() => {
    _generateOgpUrl();
  }, []);

  const [queryParams, setQueryParams] = useState<URLSearchParams | null>(null);
  const generateQueryParams = (topTracks: TrackList) => {
    const searchParams = new URLSearchParams({
      first: topTracks[0].name || "",
      second: topTracks[1].name || "",
      third: topTracks[2].name || "",
    });

    console.log("searchParams", searchParams);

    setQueryParams(() => searchParams);
  };
  useEffect(() => {
    if (!topTracks) return;
    generateQueryParams(topTracks);
  }, [topTracks]);

  return { getTopTracks, topTracks, ogpUrl, queryParams, generateQueryParams };
};
