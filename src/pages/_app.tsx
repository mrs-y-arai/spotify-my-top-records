import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Header from "~/components/layouts/Header";
import Footer from "~/components/layouts/Footer";
import Loading from "~/components/layouts/Loading";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Loading />
      <Header />
      <main
        className={`flex min-h-screen flex-col items-center justify-between pt-24 pb-7 px-5 md:px-10 ${inter.className}`}
      >
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
