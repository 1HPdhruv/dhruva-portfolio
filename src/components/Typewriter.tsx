import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
}

export const Typewriter = ({ text, speed = 55, startDelay = 400, className }: TypewriterProps) => {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {shown}
      <span className="inline-block w-[2px] h-[1em] align-middle bg-primary ml-1 animate-pulse" />
    </span>
  );
};
