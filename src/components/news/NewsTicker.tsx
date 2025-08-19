import React, { useEffect, useRef } from "react";
import { NewsItem } from "./NewsCard";

type Props = {
  items: NewsItem[];
  onItemClick?: (id: string) => void;
  title?: string;
};

const NewsTicker: React.FC<Props> = ({ items, onItemClick, title }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let anim: number;
    let scroll = 0;
    const step = () => {
      scroll += 0.5; // speed
      el.scrollTop = scroll;
      if (scroll >= el.scrollHeight - el.clientHeight) scroll = 0;
      anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
    return () => cancelAnimationFrame(anim);
  }, [items.length]);

  return (
    <aside className="h-full flex flex-col">
      {title && <h2 className="text-sm font-medium text-muted-foreground px-2 mb-2">{title}</h2>}
      <div ref={containerRef} className="overflow-y-hidden h-full pr-2">
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className="text-sm">
              <button
                onClick={() => onItemClick?.(it.id)}
                className="text-left text-foreground/80 hover:text-foreground transition-colors"
              >
                {it.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default NewsTicker;
