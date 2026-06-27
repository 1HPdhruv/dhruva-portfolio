import { useEffect, useRef } from "react";

export function IntroSequence() {
  const audioPlayedRef = useRef(false);

  useEffect(() => {
    if (audioPlayedRef.current) return;

    const audio = new Audio("/audio/Voice-1.mp3");
    audio.volume = 1.0;

    const playAudio = () => {
      if (audioPlayedRef.current) return;
      audio.play().then(() => {
        audioPlayedRef.current = true;
        cleanup();
      }).catch((err) => {
        console.warn("Autoplay blocked by browser, waiting for user interaction to play voice:", err);
      });
    };

    const onUserInteract = () => {
      if (!audioPlayedRef.current) {
        playAudio();
      }
    };

    // Attempt autoplay immediately as the portfolio opens
    playAudio();

    // Add listeners in case autoplay is blocked by browser policy
    window.addEventListener("click", onUserInteract, { once: true });
    window.addEventListener("keydown", onUserInteract, { once: true });
    window.addEventListener("pointerdown", onUserInteract, { once: true });
    window.addEventListener("touchstart", onUserInteract, { once: true });
    window.addEventListener("scroll", onUserInteract, { once: true });

    function cleanup() {
      window.removeEventListener("click", onUserInteract);
      window.removeEventListener("keydown", onUserInteract);
      window.removeEventListener("pointerdown", onUserInteract);
      window.removeEventListener("touchstart", onUserInteract);
      window.removeEventListener("scroll", onUserInteract);
    }

    return () => {
      cleanup();
    };
  }, []);

  // No visual stages or overlays — keep only the voice as the portfolio opens
  return null;
}
