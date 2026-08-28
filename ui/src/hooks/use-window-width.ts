import { useEffect, useState } from "react";

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 0;
  });

  useEffect(() => {
    function handleWindowResizeWidth() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowResizeWidth);

    return () => window.removeEventListener("resize", handleWindowResizeWidth);
  }, []);

  return windowWidth;
}
