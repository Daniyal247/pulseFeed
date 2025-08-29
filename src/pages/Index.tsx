import React, { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import NewsCard, { NewsItem } from "@/components/news/NewsCard";
import PodcastCard, { PodcastItem } from "@/components/podcast/PodcastCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ALL_CATEGORIES } from "@/constants/categories";
import { api } from "@/services/api";

// ---------------- MOCK DATA ----------------
const mockItems: NewsItem[] = Array.from({ length: 16 }).map((_, i) => ({
  id: String(i + 1),
  title: `Breaking News: ${ALL_CATEGORIES[i % ALL_CATEGORIES.length]} Development ${i + 1}`,
  summary:
    "This is a comprehensive 60-word summary that provides detailed information about the current news story. It covers the key points, implications, and context that readers need to understand the significance of this development.",
  content: "This is the comprehensive coverage of this story. Detailed Analysis: The situation encompasses multiple dimensions that require careful examination. Industry experts have been monitoring these developments closely, providing valuable insights into the broader implications.",
  llm_summary: "ملخص شامل للأخبار العاجلة مع تحليل مفصل للتطورات الجارية والتأثيرات المحتملة على مختلف الأطراف المعنية.",
  image: "/placeholder.svg",
  category: ALL_CATEGORIES[i % ALL_CATEGORIES.length],
  source: "PulseFeed Wire",
  published_at: new Date(Date.now() - i * 3600_000).toISOString(),
}));

const podcastMockItems: PodcastItem[] = [
  {
    id: "p1",
    title: "برنامج الأخبار التقنية",
    description:
      "تحليل عميق لأحدث التطورات في عالم التكنولوجيا والذكاء الاصطناعي. نستكشف التقنيات الناشئة وتأثيرها على المجتمع والاقتصاد العالمي.",
    category: "Technology",
    host: "أحمد التقني",
    duration: "45 دقيقة",
    published_at: new Date(Date.now() - 1 * 24 * 3600_000).toISOString(),
  },
  {
    id: "p2",
    title: "الأخبار الاقتصادية اليومية",
    description:
      "متابعة شاملة للأسواق المالية العالمية والمحلية. تحليل اقتصادي متعمق للاتجاهات والفرص الاستثمارية.",
    category: "Business",
    host: "سارة الاقتصادية",
    duration: "30 دقيقة",
    published_at: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
  },
  // ... add more if needed
];

// ---------------- COMPONENT ----------------
const Index: React.FC = () => {
  const navigate = useNavigate();

  const [selectedCategories, setSelected] = useState<string[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    // Try to load saved news from localStorage first
    try {
      const saved = localStorage.getItem('pulsefeed_news');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : mockItems;
      }
    } catch (e) {
      console.log('Failed to load saved news, using mock data');
    }
    return mockItems;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPodcastPlaying, setIsPodcastPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Fetch initial news and open streaming socket
  useEffect(() => {
    let ws: WebSocket | null = null;
    const fetchNews = async () => {
      try {
        const response = await api.getFeed();
        if (response && response.items) {
          // Only update if we don't already have news items from localStorage
          setNewsItems((prev) => {
            if (prev === mockItems || prev.length === 0) {
              return response.items;
            }
            return prev; // Keep existing items from localStorage
          });
        }
      } catch {
        console.log("Using mock data as backend is not available");
      }
    };
    fetchNews();

    try {
      console.log('Opening WebSocket connection...');
      ws = api.openNewsStream();
      
      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setWsStatus('connected');
      };
      
      ws.onmessage = (evt) => {
        console.log('WebSocket message received:', evt.data);
        try {
          const item = JSON.parse(evt.data) as NewsItem;
          console.log('Parsed news item:', item);
          setNewsItems((prev) => {
            // Check if item already exists
            const existingIndex = prev.findIndex((p) => p.id === item.id);
            let updated;
            if (existingIndex !== -1) {
              // Update existing item with new data (like llm_summary)
              updated = [...prev];
              updated[existingIndex] = { ...updated[existingIndex], ...item };
              console.log('Updated existing item at index:', existingIndex);
            } else {
              // Add new item to the beginning, preserving existing items
              updated = [item, ...prev];
              console.log('Added new item, total items now:', updated.length);
            }
            
            // Keep only last 20 items to prevent localStorage from getting too large
            const trimmed = updated.slice(0, 20);
            
            // Save to localStorage
            try {
              localStorage.setItem('pulsefeed_news', JSON.stringify(trimmed));
            } catch (e) {
              console.log('Failed to save news to localStorage');
            }
            
            return trimmed;
          });
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsStatus('disconnected');
        // Don't close the connection on error, let it try to reconnect
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setWsStatus('disconnected');
        // Try to reconnect after a delay if not a normal closure
        if (event.code !== 1000) {
          setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            // This will trigger the useEffect again
          }, 5000);
        }
      };
      
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
    }

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  // Save news to localStorage whenever newsItems changes
  useEffect(() => {
    if (newsItems.length > 0 && newsItems !== mockItems) {
      try {
        // Keep only last 20 items
        const trimmed = newsItems.slice(0, 20);
        localStorage.setItem('pulsefeed_news', JSON.stringify(trimmed));
      } catch (e) {
        console.log('Failed to save news to localStorage');
      }
    }
  }, [newsItems]);

  // Filter news by category
  const filtered = useMemo(() => {
    if (!selectedCategories.length) return newsItems;
    return newsItems.filter((item) => selectedCategories.includes(item.category || ""));
  }, [selectedCategories, newsItems]);

  // Stop all speech
  const stopAllSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPodcastPlaying(false);
    setCurrentSpeech(null);
  };

  // ---------------- HANDLERS ----------------
  const handleVoiceToggle = () => {
    if (isPlaying) {
      stopAllSpeech();
      return;
    }

    stopAllSpeech();
    const summariesText = filtered
      .map((item) => `${item.title}. ${item.summary}`)
      .join(". المقال التالي: ");

    if (!summariesText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(summariesText);
    utterance.rate = 1;
    utterance.pitch = 0.6;
    utterance.volume = 0.9;
    utterance.lang = "ar";

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentSpeech(null);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentSpeech(null);
    };

    setCurrentSpeech(utterance);
    window.speechSynthesis.speak(utterance);
  };

  const handlePodcastVoiceToggle = () => {
    if (isPodcastPlaying) {
      stopAllSpeech();
      return;
    }

    stopAllSpeech();
    const podcastText = podcastMockItems
      .map((item) => `${item.title}. ${item.description}. يقدمه ${item.host}.`)
      .join(". البرنامج التالي: ");

    if (!podcastText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(podcastText);
    utterance.rate = 0.8;
    utterance.pitch = .51;
    utterance.volume = 0.9;
    utterance.lang = "ar";

    utterance.onstart = () => setIsPodcastPlaying(true);
    utterance.onend = () => {
      setIsPodcastPlaying(false);
      setCurrentSpeech(null);
    };
    utterance.onerror = () => {
      setIsPodcastPlaying(false);
      setCurrentSpeech(null);
    };

    setCurrentSpeech(utterance);
    window.speechSynthesis.speak(utterance);
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen">
      <SEO title="PulseFeed – Personalized News Feed" description="Your personalized news feed with intelligent voice narration." />
      <Header />

      {/* Top Heading */}
      <h1 className="text-2xl font-semibold text-gray-800 mr-4 text-right md:pr-[310px]">
        الأخبار الرياضية والعامة
      </h1>

      <main className="container mx-auto py-6 space-y-6">
        {/* Header Section with Voice Button */}
        <section className="flex items-center justify-between md:pl-[320px]">
          <Button
            onClick={handleVoiceToggle}
            variant={isPlaying ? "destructive" : "default"}
            size="lg"
            className="w-16 h-16 rounded-full flex items-center justify-center p-0 aspect-square"
          >
            {isPlaying ? (
              <VolumeX className="w-8 h-8" />
            ) : (
              <img src="/play_button.jpg" alt="Play" className="w-12 h-12 object-cover rounded-full" />
            )}
          </Button>
          <div className="text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-grey-800 mr-4 md:pr-[310px]">
              تغذيتك المخصصة
            </h1>
          </div>
        </section>

        {/* WebSocket Status and Test Button */}
        {/* <section className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  wsStatus === 'connected' ? 'bg-green-500' : 
                  wsStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-600">
                {wsStatus === 'connected' ? 'Live News Connected' : 
                 wsStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {newsItems.length > 0 && newsItems !== mockItems ? 
                `${newsItems.length} news items loaded` : 'Using mock data'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:8000/api/news/test-stream');
                  const data = await response.json();
                  console.log('Test stream response:', data);
                } catch (e) {
                  console.error('Test stream failed:', e);
                }
              }}
              variant="outline"
            >
              Test Stream
            </Button>
            
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:8000/api/news/test-rss-simple');
                  const data = await response.json();
                  console.log('Simple RSS test response:', data);
                } catch (e) {
                  console.error('Simple RSS test failed:', e);
                }
              }}
              variant="outline"
            >
              Test RSS Simple
            </Button>
            
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:8000/api/news/feed');
                  const data = await response.json();
                  if (data && data.items) {
                    setNewsItems(data.items);
                    // Save to localStorage
                    try {
                      const trimmed = data.items.slice(0, 20);
                      localStorage.setItem('pulsefeed_news', JSON.stringify(trimmed));
                    } catch (e) {
                      console.log('Failed to save news to localStorage');
                    }
                  }
                } catch (e) {
                  console.error('Manual refresh failed:', e);
                }
              }}
              variant="secondary"
            >
              Manual Refresh
            </Button>
          </div>
        </section> */}

        {/* News Grid */}
        <section>
          <div className="grid grid-cols-1 gap-6">
            {filtered.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found for the selected categories.</p>
            <Button variant="outline" onClick={() => setSelected([])} className="mt-4">
              Show All Articles
            </Button>
          </div>
        )}

        {/* Podcast Section */}
        <section className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
                <Headphones className="w-7 h-7 text-purple-400" />
                قسم البودكاست - Your Podcast Section
              </h2>
              <p className="text-gray-400 mt-1">
                استمع إلى أفضل البرامج الصوتية المتخصصة - Listen to the best specialized audio programs
              </p>
            </div>
            <Button
              onClick={handlePodcastVoiceToggle}
              variant={isPodcastPlaying ? "destructive" : "secondary"}
              size="lg"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 aspect-square w-12 h-12 justify-center"
            >
              {isPodcastPlaying ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <img src="/play_button.jpg" alt="Play" className="w-8 h-8 object-cover rounded-full" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {podcastMockItems.map((item) => (
              <PodcastCard key={item.id} item={item} onClick={() => console.log(`Playing podcast: ${item.title}`)} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;


















// import React, { useEffect, useMemo, useState } from "react";
// import SEO from "@/components/SEO";
// import Header from "@/components/layout/Header";
// import NewsCard, { NewsItem } from "@/components/news/NewsCard";
// import PodcastCard, { PodcastItem } from "@/components/podcast/PodcastCard";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Volume2, VolumeX, Headphones } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { ALL_CATEGORIES } from "@/constants/categories";
// import { api } from "@/services/api";
// import elevenlabsStreamingTTS from "@/services/elevenlabs-streaming-tts";

// // Enhanced mock items with longer 60-word summaries
// const mockItems: NewsItem[] = Array.from({ length: 16 }).map((_, i) => ({
//   id: String(i + 1),
//   title: `Breaking News: ${ALL_CATEGORIES[i % ALL_CATEGORIES.length]} Development ${i + 1}`,
//   summary: "This is a comprehensive 60-word summary that provides detailed information about the current news story. It covers the key points, implications, and context that readers need to understand the significance of this development. The summary includes background information, current status, and potential future impacts on various stakeholders and the broader market situation.",
//   image: "/placeholder.svg",
//   category: ALL_CATEGORIES[i % ALL_CATEGORIES.length],
//   source: "PulseFeed Wire",
//   published_at: new Date(Date.now() - i * 3600_000).toISOString(),
// }));

// // Podcast mock data with Arabic descriptions
// const podcastMockItems: PodcastItem[] = [
//   {
//     id: "p1",
//     title: "برنامج الأخبار التقنية",
//     description: "تحليل عميق لأحدث التطورات في عالم التكنولوجيا والذكاء الاصطناعي. نستكشف التقنيات الناشئة وتأثيرها على المجتمع والاقتصاد العالمي مع خبراء متخصصين في المجال.",
//     category: "Technology",
//     host: "أحمد التقني",
//     duration: "45 دقيقة",
//     published_at: new Date(Date.now() - 1 * 24 * 3600_000).toISOString(),
//   },
//   {
//     id: "p2",
//     title: "الأخبار الاقتصادية اليومية",
//     description: "متابعة شاملة للأسواق المالية العالمية والمحلية. تحليل اقتصادي متعمق للاتجاهات والفرص الاستثمارية مع تقييم المخاطر والتوقعات المستقبلية للأسواق.",
//     category: "Business",
//     host: "سارة الاقتصادية",
//     duration: "30 دقيقة",
//     published_at: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
//   },
//   {
//     id: "p3",
//     title: "رياضة بلا حدود",
//     description: "تغطية شاملة للأحداث الرياضية المحلية والعالمية. مقابلات حصرية مع الرياضيين والمدربين وتحليل فني للمباريات والبطولات المهمة.",
//     category: "Sports",
//     host: "محمد الرياضي",
//     duration: "40 دقيقة",
//     published_at: new Date(Date.now() - 3 * 24 * 3600_000).toISOString(),
//   },
//   {
//     id: "p4",
//     title: "الصحة والعافية",
//     description: "برنامج متخصص في الصحة العامة والطب الحديث. نقدم نصائح طبية من خبراء معتمدين ونناقش أحدث العلاجات والاكتشافات الطبية.",
//     category: "Health",
//     host: "د. فاطمة الطبيبة",
//     duration: "35 دقيقة",
//     published_at: new Date(Date.now() - 4 * 24 * 3600_000).toISOString(),
//   },
//   {
//     id: "p5",
//     title: "السياسة والمجتمع",
//     description: "تحليل سياسي معمق للأحداث المحلية والإقليمية والدولية. مناقشات موضوعية حول القضايا المجتمعية المهمة والتطورات السياسية.",
//     category: "Politics",
//     host: "خالد السياسي",
//     duration: "50 دقيقة",
//     published_at: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(),
//   },
//   {
//     id: "p6",
//     title: "العلوم والاكتشافات",
//     description: "رحلة في عالم العلوم والاكتشافات الحديثة. نقدم المعلومات العلمية المعقدة بطريقة مبسطة ومفهومة للجمهور العام مع أحدث البحوث.",
//     category: "Science",
//     host: "د. يوسف العالم",
//     duration: "42 دقيقة",
//     published_at: new Date(Date.now() - 6 * 24 * 3600_000).toISOString(),
//   },
//   {
//     id: "p7",
//     title: "الترفيه والثقافة",
//     description: "استعراض لآخر أخبار الترفيه والفن والثقافة. مقابلات مع النجوم والفنانين ومراجعات للأعمال الفنية الجديدة والأحداث الثقافية المهمة.",
//     category: "Entertainment",
//     host: "ليلى الفنانة",
//     duration: "38 دقيقة",
//     published_at: new Date(Date.now() - 7 * 24 * 3600_000).toISOString(),
//   },
//   {
//     id: "p8",
//     title: "الطاقة والبيئة",
//     description: "برنامج متخصص في قضايا الطاقة المتجددة وحماية البيئة. نناقش الحلول المستدامة والتقنيات الخضراء والسياسات البيئية الفعالة.",
//     category: "Energy",
//     host: "أمين البيئي",
//     duration: "33 دقيقة",
//     published_at: new Date(Date.now() - 8 * 24 * 3600_000).toISOString(),
//   },
// ];

// const Index: React.FC = () => {
//   const navigate = useNavigate();
//   const [selectedCategories, setSelected] = useState<string[]>([]);
//   const [newsItems, setNewsItems] = useState<NewsItem[]>(mockItems);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isPodcastPlaying, setIsPodcastPlaying] = useState(false);

//   // Fetch news from backend
//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         console.log("Fetching news from backend...");
//         const response = await api.getFeed();
//         console.log("Backend response:", response);
        
//         if (response && response.items && response.items.length > 0) {
//           console.log("Setting real news data:", response.items);
//           setNewsItems(response.items);
//         } else {
//           console.log("No items in response, keeping mock data");
//         }
//       } catch (error) {
//         console.log("Backend not available, using mock data:", error);
//         // Keep using mock data
//       }
//     };
//     fetchNews();
//   }, []);

//   const filtered = useMemo(() => {
//     if (!selectedCategories.length) return newsItems;
//     return newsItems.filter((item) => selectedCategories.includes(item.category || ""));
//   }, [selectedCategories, newsItems]);

//   // Helper function to stop all speech
//   const stopAllSpeech = () => {
//     elevenlabsStreamingTTS.stop();
//     setIsPlaying(false);
//     setIsPodcastPlaying(false);
//   };

//   // Voice/Speech functionality for news
//   const handleVoiceToggle = () => {
//     if (isPlaying) {
//       // Stop current speech
//       stopAllSpeech();
//     } else {
//       // Stop any existing speech first
//       stopAllSpeech();
      
//       console.log("Current filtered news items:", filtered);
//       console.log("News items from state:", newsItems);
      
//       // Start reading all summaries - use the actual fetched data
//       const summariesText = filtered.map(item => `${item.title}. ${item.summary}`).join(". Next article: ");
      
//       console.log("Text to be read:", summariesText);
      
//       if (!summariesText.trim()) {
//         console.warn("No news content to read");
//         return;
//       }
      
//       // Use ElevenLabs Streaming TTS
//       try {
//         elevenlabsStreamingTTS.speak(summariesText).then(() => {
//           console.log("Started ElevenLabs Streaming TTS");
//           setIsPlaying(true);
//           setIsPodcastPlaying(false);
//         }).catch(error => {
//           console.error("ElevenLabs Streaming TTS error:", error);
//           setIsPlaying(false);
//         });
//       } catch (error) {
//         console.error("Failed to start ElevenLabs Streaming TTS:", error);
//         setIsPlaying(false);
//       }
//     }
//   };

//   // Voice/Speech functionality for podcasts
//   const handlePodcastVoiceToggle = () => {
//     if (isPodcastPlaying) {
//       // Stop current speech
//       stopAllSpeech();
//     } else {
//       // Stop any existing speech first
//       stopAllSpeech();
      
//       // Start reading all podcast descriptions
//       const podcastText = podcastMockItems.map(item => `${item.title}. ${item.description}. يقدمه ${item.host}.`).join(". البرنامج التالي: ");
      
//       if (!podcastText.trim()) {
//         console.warn("No podcast content to read");
//         return;
//       }
      
//       // Use ElevenLabs Streaming TTS
//       try {
//         elevenlabsStreamingTTS.speak(podcastText).then(() => {
//           console.log("Started ElevenLabs Streaming TTS for podcast");
//           setIsPodcastPlaying(true);
//           setIsPlaying(false);
//         }).catch(error => {
//           console.error("ElevenLabs Streaming TTS error:", error);
//           setIsPodcastPlaying(false);
//         });
//       } catch (error) {
//         console.error("Failed to start ElevenLabs Streaming TTS for podcast:", error);
//         setIsPodcastPlaying(false);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <SEO title="PulseFeed – Personalized News Feed" description="Your personalized news feed with intelligent voice narration." />
//       <Header />
      
//       {/* Top Heading */}
//       <h1 className="text-2xl font-semibold text-gray-800 mr-4 text-right md:pr-[150px]">
//         الأخبار الرياضية والعامة
//       </h1>
//       <main className="container mx-auto py-6 space-y-6">
//         {/* Header Section with Voice Button */}
//         <section className="flex items-center justify-between md:pl-[180px]">
//           <Button 
//             onClick={handleVoiceToggle}
//             variant={isPlaying ? "destructive" : "default"}
//             size="lg"
//             className="w-12 h-12 rounded-full flex items-center justify-center p-0 aspect-square"
//           >
//             {isPlaying ? <VolumeX className="w-6 h-6" /> : <img src="/play_button.jpg" alt="Play" className="w-8 h-8 object-cover rounded-full" />}
//           </Button>
//           <div className="text-left align-center">
//             <h1 className="text-3xl font-semibold tracking-tight text-grey-800 mr-4 md:pr-[170px]">تغذيتك المخصصة</h1>
//           </div>
//         </section>

//         {/* Category Filter Section - Hidden */}
//         <section className="hidden">
//           <div className="flex flex-wrap gap-2">
//             {ALL_CATEGORIES.filter(
//               (c) => c === "Sports" || c === "Global News"
//             ).map((c) => (
//               <button
//                 key={c}
//                 onClick={() =>
//                   setSelected((prev) =>
//                     prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
//                   )
//                 }
//                 aria-pressed={selectedCategories.includes(c)}
//               >
//                 {selectedCategories.includes(c) ? <Badge variant="secondary">{c}</Badge> : c}
//               </button>
//             ))}
//             {selectedCategories.length > 0 && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setSelected([])}
//               >
//                 Clear All
//               </Button>
//             )}
//           </div>
//         </section>

//         {/* News Grid */}
//         <section>
//           <div className="grid grid-cols-1 gap-6">
//             {filtered.map((item) => (
//               <NewsCard 
//                 key={item.id} 
//                 item={item} 
//                 onClick={() => navigate(`/news/${item.id}`)} 
//               />
//             ))}
//           </div>
//         </section>

//         {filtered.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">No articles found for the selected categories.</p>
//             <Button variant="outline" onClick={() => setSelected([])} className="mt-4">
//               Show All Articles
//             </Button>
//           </div>
//         )}

//         {/* Podcast Section */}
//         <section className="border-t border-gray-800 pt-8 mt-12">
//           {/* Podcast Header with Voice Button */}
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
//                 <Headphones className="w-7 h-7 text-purple-400" />
//                 قسم البودكاست - Your Podcast Section
//               </h2>
//               <p className="text-gray-400 mt-1">
//                 استمع إلى أفضل البرامج الصوتية المتخصصة - Listen to the best specialized audio programs
//               </p>
//             </div>
//             <Button 
//               onClick={handlePodcastVoiceToggle}
//               variant={isPodcastPlaying ? "destructive" : "secondary"}
//               size="lg"
//               className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 aspect-square w-12 h-12 justify-center"
//             >
//               {isPodcastPlaying ? <VolumeX className="w-5 h-5" /> : <img src="/play_button.jpg" alt="Play" className="w-8 h-8 object-cover rounded-full" />}
//             </Button>
//           </div>

//           {/* Podcast Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {podcastMockItems.map((item) => (
//               <PodcastCard 
//                 key={item.id} 
//                 item={item} 
//                 onClick={() => {
//                   console.log(`Playing podcast: ${item.title}`);
//                 }} 
//               />
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Index;


// import React, { useEffect, useMemo, useState } from "react";
// import SEO from "@/components/SEO";
// import Header from "@/components/layout/Header";
// import Navigation from "@/components/layout/Navigation";
// import NewsCard, { NewsItem } from "@/components/news/NewsCard";
// import PodcastCard, { PodcastItem } from "@/components/podcast/PodcastCard";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Volume2, VolumeX, Headphones } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { ALL_CATEGORIES } from "@/constants/categories";
// import { api } from "@/services/api";
// import elevenlabsStreamingTTS from "@/services/elevenlabs-streaming-tts";

// // Enhanced mock items with longer 60-word summaries
// const mockItems: NewsItem[] = Array.from({ length: 16 }).map((_, i) => ({
//   id: String(i + 1),
//   title: `Breaking News: ${ALL_CATEGORIES[i % ALL_CATEGORIES.length]} Development ${i + 1}`,
//   summary: "This is a comprehensive 60-word summary that provides detailed information about the current news story. It covers the key points, implications, and context that readers need to understand the significance of this development. The summary includes background information, current status, and potential future impacts on various stakeholders and the broader market situation.",
//   image: "/placeholder.svg",
//   category: ALL_CATEGORIES[i % ALL_CATEGORIES.length],
//   source: "PulseFeed Wire",
//   published_at: new Date(Date.now() - i * 3600_000).toISOString(),
// }));

// // Podcast mock data with Arabic descriptions
// const podcastMockItems: PodcastItem[] = [
//   {
//     id: "p2",
//     title: "الأخبار الاقتصادية اليومية",
//     description: "متابعة شاملة للأسواق المالية العالمية والمحلية. تحليل اقتصادي متعمق للاتجاهات والفرص الاستثمارية مع تقييم المخاطر والتوقعات المستقبلية للأسواق.",
//     category: "Business",
//     host: "سارة الاقتصادية",
//     duration: "30 دقيقة",
//     published_at: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
//   },
//   {
//     id: "p3",
//     title: "رياضة بلا حدود",
//     description: "تغطية شاملة للأحداث الرياضية المحلية والعالمية. مقابلات حصرية مع الرياضيين والمدربين وتحليل فني للمباريات والبطولات المهمة.",
//     category: "Sports",
//     host: "محمد الرياضي",
//     duration: "40 دقيقة",
//     published_at: new Date(Date.now() - 3 * 24 * 3600_000).toISOString(),
//   },
//   {
//     id: "p5",
//     title: "تحليل الأسواق المالية",
//     description: "برنامج متخصص في تحليل الأسواق المالية والاستثمارات. نقدم نصائح استثمارية من خبراء معتمدين ونناقش أحدث التطورات في عالم المال والأعمال.",
//     category: "Business",
//     host: "عمر المالي",
//     duration: "35 دقيقة",
//     published_at: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(),
//   },
// ];

// const Index: React.FC = () => {
//   const navigate = useNavigate();
//   const [newsItems, setNewsItems] = useState<NewsItem[]>(mockItems);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isPodcastPlaying, setIsPodcastPlaying] = useState(false);

//   // Fetch news from backend
//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const response = await api.getFeed();
//         if (response && response.items) {
//           setNewsItems(response.items);
//         }
//       } catch (error) {
//         console.log("Using mock data as backend is not available");
//         // Keep using mock data
//       }
//     };
//     fetchNews();
//   }, []);

//   // Filter for Sports and Financial categories
//   const filtered = useMemo(() => {
//     return newsItems.filter((item) => 
//       item.category === "Sports" || 
//       item.category === "Global News" || 
//       item.category === "Local News"
//     );
//   }, [newsItems]);

//   // Filter podcasts for Sports and Financial
//   const filteredPodcasts = useMemo(() => {
//     return podcastMockItems.filter(item => 
//       item.category === "Sports" || item.category === "Global News"
//     );
//   }, []);

//   // Helper function to stop all speech
//   const stopAllSpeech = () => {
//     elevenlabsStreamingTTS.stop();
//     setIsPlaying(false);
//     setIsPodcastPlaying(false);
//   };

//   // Voice/Speech functionality for news
//   const handleVoiceToggle = () => {
//     if (isPlaying) {
//       // Stop current speech
//       stopAllSpeech();
//     } else {
//       // Stop any existing speech first
//       stopAllSpeech();
      
//       // Prepare individual news articles for sequential reading
//       const summariesText = filtered.map(item => `${item.title}. ${item.summary}`).join(". Next article: ").slice(0, 1000);
      
//       if (!summariesText.trim()) {
//         console.warn("No news content to read");
//         return;
//       }

      
      
//       // Use ElevenLabs Streaming TTS with sequential reading
//       try {
//         elevenlabsStreamingTTS.speak(summariesText).then(() => {
//           console.log("Started ElevenLabs Sequential TTS");
//           setIsPlaying(true);
//           setIsPodcastPlaying(false);
//         }).catch(error => {
//           console.error("ElevenLabs Streaming TTS error:", error);
//           setIsPlaying(false);
//         });
//       } catch (error) {
//         console.error("Failed to start ElevenLabs Streaming TTS:", error);
//         setIsPlaying(false);
//       }
//     }
//   };

//   // Voice/Speech functionality for podcasts
//   const handlePodcastVoiceToggle = () => {
//     if (isPodcastPlaying) {
//       // Stop current speech
//       stopAllSpeech();
//     } else {
//       // Stop any existing speech first
//       stopAllSpeech();
      
//       // Start reading all podcast descriptions
//       const podcastText = filteredPodcasts.map(item => `${item.title}. ${item.description}. يقدمه ${item.host}.`).join(". البرنامج التالي: ");
      
//       if (!podcastText.trim()) {
//         console.warn("No podcast content to read");
//         return;
//       }
      
//       // Use ElevenLabs Streaming TTS
//       try {
//         elevenlabsStreamingTTS.speak(podcastText).then(() => {
//           console.log("Started ElevenLabs Streaming TTS for podcast");
//           setIsPodcastPlaying(true);
//           setIsPlaying(false);
//         }).catch(error => {
//           console.error("ElevenLabs Streaming TTS error:", error);
//           setIsPodcastPlaying(false);
//         });
//       } catch (error) {
//         console.error("Failed to start ElevenLabs Streaming TTS for podcast:", error);
//         setIsPodcastPlaying(false);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <SEO title="PulseFeed – Personalized News Feed" description="Your personalized news feed with intelligent voice narration." />
//       <Header />
//       {/* <Navigation /> */}
      
//       <h1 className="text-2xl font-semibold text-gray-800 mr-4 text-right md:pr-[300px]">
//          الأخبار الرياضية والعامة
//       </h1>
//       <main className="container mx-auto py-6 space-y-6">
//         {/* Header Section with Voice Button */}
//         <section className="flex items-center justify-between md:pl-[330px]">
//           <Button 
//             onClick={handleVoiceToggle}
//             variant={isPlaying ? "destructive" : "default"}
//             size="lg"
//             className="w-12 h-12 rounded-full flex items-center justify-center p-0 aspect-square"
//           >
//             {isPlaying ? 
//               <VolumeX className="w-6 h-6" /> : 
//               <img src="/play_button.jpg" alt="Play" className="w-8 h-8 object-cover rounded-full" />
//             }
//           </Button>
//           <div className="text-left align-center">
//             <h2 className="text-3xl font-semibold tracking-tight text-grey-800 mr-4 md:pr-[300px]">
//               تغذيتك المخصصة
//             </h2>
//           </div>
//         </section>

//         {/* News Grid - 4 columns */}
//         <section>
//           <div className="grid grid-cols-1 gap-6">
//             {filtered.map((item) => (
//               <NewsCard 
//                 key={item.id} 
//                 item={item} 
//                 onClick={() => navigate(`/news/${item.id}`)} 
//               />
//             ))}
//           </div>
//         </section>

//         {filtered.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">No sports or financial articles found.</p>
//           </div>
//         )}

//         {/* Podcast Section */}
//         <section className="border-t border-gray-800 pt-8 mt-12">
//           {/* Podcast Header with Voice Button */}
//           <div className="mb-6">
//             <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-3 mb-4">
//               <Headphones className="w-7 h-7 text-purple-400" />
//               قسم البودكاست - Sports & General Podcasts
//             </h2>
//             <p className="text-gray-400 mt-1 mb-4">
//               استمع إلى أفضل البرامج الصوتية المتخصصة - Listen to the best specialized audio programs
//             </p>
//             <Button 
//               onClick={handlePodcastVoiceToggle}
//               variant={isPodcastPlaying ? "destructive" : "secondary"}
//               size="lg"
//               className="w-12 h-12 rounded-full flex items-center justify-center p-0 aspect-square bg-purple-600 hover:bg-purple-700 text-white"
//             >
//               {isPodcastPlaying ? 
//                 <VolumeX className="w-5 h-5" /> : 
//                 <img src="/play_button.jpg" alt="Play" className="w-8 h-8 object-cover rounded-full" />
//               }
//             </Button>
//           </div>

//           {/* Podcast Grid - 4 columns */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredPodcasts.map((item) => (
//               <PodcastCard 
//                 key={item.id} 
//                 item={item} 
//                 onClick={() => {
//                   // Handle podcast click - could navigate to podcast player
//                   console.log(`Playing podcast: ${item.title}`);
//                 }} 
//               />
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Index;