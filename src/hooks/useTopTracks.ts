import { useEffect, useState } from "react";

export const useTopTracks = () => {
  type Track = {
    id: number;
    name: string;
    thumbnail: {
      url: string | null;
      width: number;
      height: number;
    };
    albumName: string;
    artistName: string;
  };

  type TopTracks = Track[];

  /**
   * トップトラック
   */
  const [topTracks, setTopTracks] = useState<TopTracks | null>(null);
  useEffect(() => {
    console.log("useEffect topTracks", topTracks);
  }, [topTracks]);

  /**
   * トップトラックを更新する
   */
  const updateTopTracks = (newTopTracks: TopTracks) => {
    setTopTracks(() => newTopTracks);
  };

  /**
   * トップトラックを取得する
   */
  const getTopTracks = async () => {
    const response = await fetch("/api/spotify/auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();
    const accessToken = responseJson.data.accessToken;

    console.log("accessToken", accessToken);

    if (!accessToken) {
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
    console.log("topTracksResponseJson", topTracksResponseJson);

    const topTracks: TopTracks = topTracksResponseJson.items.map(
      (item: any, index: number): Track => {
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
  };

  return { getTopTracks, topTracks };
};
