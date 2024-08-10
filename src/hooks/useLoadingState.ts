import { useAtom, atom } from "jotai";
import { atomEffect } from "jotai-effect";

const loadingAtom = atom<boolean>(true);
const loadingKeyAtom = atom<string[]>([]);

const changeKeyEffect = atomEffect((get, set) => {
  if (get(loadingKeyAtom).length > 0) {
    set(loadingAtom, true);
    return;
  }

  set(loadingAtom, false);
});

export const useLoadingState = () => {
  /**
   * ローディング中のキー配列
   * クライアントfetchする際に複数軸でローディング中になることがあるため、その場合はキーで管理する
   */
  const [_, setLoadingKeyList] = useAtom(loadingKeyAtom);

  /**
   * ローディング中のキーの変更を監視
   */
  useAtom(changeKeyEffect);

  /**
   * ローディング中のキーを追加
   */
  const addLoadingKey = (key: string) => {
    setLoadingKeyList((prev) => {
      return [...prev, key];
    });
  };

  /**
   * ローディング中のキーを削除
   */
  const removeLoadingKey = (key: string) => {
    setLoadingKeyList((prev) => {
      return prev.filter((k) => k !== key);
    });
  };

  /**
   * 強制的にローディングキーをリセットする。
   * これを使うと、ローディング画面が強制的に消える。
   * 基本使わない。エラー画面遷移時に使う。
   */
  const resetLoadingKey = () => {
    setLoadingKeyList(() => []);
  };

  /**
   * ローディング状態
   */
  const [isLoading, setLoadingValue] = useAtom(loadingAtom);

  /**
   * ローディング開始
   */
  const startLoading = () => {
    setLoadingValue(() => true);
    document.body.style.overflow = "hidden";
  };

  /**
   * ローディング終了
   */
  const stopLoading = () => {
    setLoadingValue(() => false);
    document.body.style.overflow = "auto";
  };

  return {
    isLoading,
    addLoadingKey,
    removeLoadingKey,
    startLoading,
    stopLoading,
    resetLoadingKey,
  };
};
