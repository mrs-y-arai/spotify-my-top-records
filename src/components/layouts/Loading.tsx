import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLoadingState } from "~/hooks/useLoadingState";
import { useRouter } from "next/router";

export default function Loading() {
  const router = useRouter();
  const { addLoadingKey, removeLoadingKey, isLoading } = useLoadingState();
  const loadingScreenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    router.events.on("routeChangeStart", () => addLoadingKey("routeChange"));
    router.events.on("routeChangeComplete", () =>
      removeLoadingKey("routeChange")
    );
    router.events.on("routeChangeError", () => removeLoadingKey("routeChange"));

    loadingScreenRef.current?.addEventListener("touchmove", (e) =>
      e.preventDefault()
    );

    return () => {
      router.events.off("routeChangeStart", () => addLoadingKey("routeChange"));
      router.events.off("routeChangeComplete", () =>
        removeLoadingKey("routeChange")
      );
      router.events.off("routeChangeError", () =>
        removeLoadingKey("routeChange")
      );
    };
  });

  return (
    <>
      {isLoading && (
        <>
          <div
            className="fixed left-0 top-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-[rgba(1,2,2,0.4)]"
            aria-label="読み込み中"
            ref={loadingScreenRef}
          >
            <p className="text-lg text-transparent gradient-color bg-clip-text font-bold mb-4">
              Loading...
            </p>
            <motion.div
              className="w-[50px] h-[50px] gradient-color rounded-full"
              initial={{ scale: 1 }}
              animate={{ scale: 1.5 }}
              transition={{
                type: "spring",
                repeat: Infinity,
                repeatType: "reverse",
                damping: 8,
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
