import * as React from "react";

/**
 * Subscribes to a media query instead of reading it once.
 *
 * Several components were reading `matchMedia(...).matches` inside an effect
 * with an empty dependency array, which latches whatever was true at hydration
 * and never updates. That is wrong in ordinary use, not just in theory: load a
 * page in a narrow window and maximise it, or rotate a tablet into landscape,
 * and the enhanced layout never arrives because the effect has already run and
 * will not run again.
 *
 * Returns `false` on the server and on the first client render, so the markup
 * matches across hydration and the enhancement applies on the following paint.
 * That makes the non-enhanced branch the default, which is the right way round
 * — it is the one that has to work everywhere.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/**
 * True when the visitor has not asked for reduced motion. Written positively so
 * call sites read as `if (motionOk)` rather than as a double negative.
 */
export function usePrefersMotion(): boolean {
  return !useMediaQuery("(prefers-reduced-motion: reduce)");
}
