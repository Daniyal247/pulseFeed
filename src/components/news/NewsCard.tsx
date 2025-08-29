// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// export type NewsItem = {
//   id: string;
//   title: string;
//   image?: string;
//   summary: string;
//   category?: string;
//   source?: string;
//   published_at?: string;
//   url?: string;
// };

// type Props = {
//   item: NewsItem;
//   onClick?: () => void;
//   className?: string;
// };

// const NewsCard: React.FC<Props> = ({ item, onClick, className }) => {
//   return (
//     // <Card className={cn("overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-white/10 bg-card border-gray-800 hover:border-gray-600", className)} onClick={onClick}>
//     <Card className={cn("overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-white/10 bg-card border-gray-800 hover:border-gray-600", className)}>
//       {item.image && (
//         // eslint-disable-next-line @next/next/no-img-element
//         <img src={item.image} alt={item.title} className="w-full h-44 object-cover" loading="lazy" />
//         )}
//       <CardContent className="p-4 space-y-2">
//         <div className="text-xs text-gray-400 flex items-center gap-2">
//           {item.category && <span className="bg-gray-200 px-2 py-1 rounded text-gray-800">{item.category}</span>}
//           {item.source && <span>• {item.source}</span>}
//           {item.published_at && <span>• {new Date(item.published_at).toLocaleString()}</span>}
//         </div>
//         <h3 className="font-medium leading-snug line-clamp-2 text-grey-800">{item.title}</h3>
//         <p className="text-sm text-gray-500 line-clamp-4 leading-relaxed">{item.summary}</p>

//         {/* Read more button
//         <Button
//           variant="link"
//           className="p-0 text-blue-500 align-left hover:underline text-xs"
//           onClick={onClick}
//         >
//           Read more →
//         </Button> */}
//         {/* ✅ Read More button */}
//         {item.url && (
//           <a
//             href={item.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-block px-3 py-1 mt-2 text-sm font-medium text-white bg-blue-600 align-right rounded-md hover:bg-blue-700 transition"
//           >
//             Read More
//           </a>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default NewsCard;



import React from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  llm_summary: string;
  category: string;
  source: string;
  url?: string;
};

type Props = {
  item: NewsItem;
  className?: string;
};

const NewsCard: React.FC<Props> = ({ item, className }) => {
  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto py-4 border-b border-gray-200",
        className
      )}
    >
      {/* Title as blue clickable link */}
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-right block text-lg font-semibold text-blue-600 hover:underline"
        >
          {item.title}
        </a>
      ) : (
        <h3 className="block text-lg font-semibold text-blue-600">
          {item.title}
        </h3>
      )}

      {/* Summary */}
      <p className="text-right mt-1 text-gray-600 text-sm leading-relaxed">
        {item.llm_summary}
      </p>

    </div>
  );
};

export default NewsCard;
