import { useCallback, useEffect, useRef, useState } from "react";

//Holds a "just added" flag for `duration` ms after each trigger. A second click inside
//the window restarts the timer rather than stacking one per click, and `tick` changes
//on every trigger so the caller can key the animated content and have the animation
//replay instead of sitting still on an element that never remounted. The timer is
//cleared on unmount so a card scrolled off screen mid-animation cannot set state on a
//component that is gone.
export const useAddedFeedback = (duration = 1400) => {
  const [added, setAdded] = useState(false);
  const [tick, setTick] = useState(0);
  const timer = useRef(null);

  const trigger = useCallback(() => {
    clearTimeout(timer.current);
    setAdded(true);
    setTick((current) => current + 1);
    timer.current = setTimeout(() => setAdded(false), duration);
  }, [duration]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { added, tick, trigger };
};
