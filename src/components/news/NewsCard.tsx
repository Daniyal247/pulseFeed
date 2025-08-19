import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type NewsItem = {
  id: string;
  title: string;
  image?: string;
  summary: string;
  category?: string;
  source?: string;
  published_at?: string;
};

type Props = {
  item: NewsItem;
  onClick?: () => void;
  className?: string;
};

const NewsCard: React.FC<Props> = ({ item, onClick, className }) => {
  return (
    <Card className={cn("overflow-hidden cursor-pointer transition-shadow hover:shadow-lg", className)} onClick={onClick}>
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt={item.title} className="w-full h-44 object-cover" loading="lazy" />
      )}
      <CardContent className="p-4 space-y-2">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          {item.category && <span>{item.category}</span>}
          {item.source && <span>• {item.source}</span>}
          {item.published_at && <span>• {new Date(item.published_at).toLocaleString()}</span>}
        </div>
        <h3 className="font-medium leading-snug line-clamp-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
