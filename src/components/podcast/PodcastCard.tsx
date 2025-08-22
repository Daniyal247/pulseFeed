import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Play, Clock, User } from "lucide-react";

export type PodcastItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
  host?: string;
  duration?: string;
  published_at?: string;
};

type Props = {
  item: PodcastItem;
  onClick?: () => void;
  className?: string;
};

const PodcastCard: React.FC<Props> = ({ item, onClick, className }) => {
  return (
    <Card className={cn("overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 bg-card border-gray-800 hover:border-purple-600 group", className)} onClick={onClick}>
      <div className="relative">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.title} className="w-full h-44 object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-44 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
            <Play className="w-12 h-12 text-white/80" />
          </div>
        )}
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-2">
        <div className="text-xs text-gray-400 flex items-center gap-2 flex-wrap">
          {item.category && (
            <span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
              {item.category}
            </span>
          )}
          {item.host && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {item.host}
            </span>
          )}
          {item.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.duration}
            </span>
          )}
          {item.published_at && (
            <span>• {new Date(item.published_at).toLocaleDateString()}</span>
          )}
        </div>
        
        <h3 className="font-medium leading-snug line-clamp-2 text-white group-hover:text-purple-200 transition-colors">
          {item.title}
        </h3>
        
        <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default PodcastCard;
