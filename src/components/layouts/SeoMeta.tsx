import Head from "next/head";

type Props = {
  ogpImage: string;
  pageTitle?: string;
  description?: string;
};

export default function SeoMeta({ pageTitle, ogpImage }: Props) {
  return (
    <Head>
      <title>
        {pageTitle
          ? `${pageTitle} | Your Spotify Top Tracks`
          : "Your Spotify Top Tracks"}
      </title>
      <meta
        property="description"
        content="あなたがSpotifyで最近聞いた曲のランキングを見ることができるサイトです。"
      />
      <meta
        property="og:title"
        content={
          pageTitle
            ? `${pageTitle} | Your Spotify Top Tracks`
            : "Your Spotify Top Tracks"
        }
      />
      <meta
        property="og:description"
        content="あなたがSpotifyで最近聞いた曲のランキングを見ることができるサイトです。"
      />
      <meta
        property="og:image"
        content={ogpImage || "/ogp_image_default.jpg"}
      />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
