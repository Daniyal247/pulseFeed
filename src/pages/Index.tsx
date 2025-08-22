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

// Enhanced mock items with longer 60-word summaries
const mockItems: NewsItem[] = Array.from({ length: 16 }).map((_, i) => ({
  id: String(i + 1),
  title: `Breaking News: ${ALL_CATEGORIES[i % ALL_CATEGORIES.length]} Development ${i + 1}`,
  summary: "This is a comprehensive 60-word summary that provides detailed information about the current news story. It covers the key points, implications, and context that readers need to understand the significance of this development. The summary includes background information, current status, and potential future impacts on various stakeholders and the broader market situation.",
  image: "/placeholder.svg",
  category: ALL_CATEGORIES[i % ALL_CATEGORIES.length],
  source: "PulseFeed Wire",
  published_at: new Date(Date.now() - i * 3600_000).toISOString(),
}));

// Podcast mock data with Arabic descriptions
const podcastMockItems: PodcastItem[] = [
  {
    id: "p1",
    title: "برنامج الأخبار التقنية",
    description: "تحليل عميق لأحدث التطورات في عالم التكنولوجيا والذكاء الاصطناعي. نستكشف التقنيات الناشئة وتأثيرها على المجتمع والاقتصاد العالمي مع خبراء متخصصين في المجال.",
    category: "Technology",
    host: "أحمد التقني",
    duration: "45 دقيقة",
    published_at: new Date(Date.now() - 1 * 24 * 3600_000).toISOString(),
  },
  {
    id: "p2",
    title: "الأخبار الاقتصادية اليومية",
    description: "متابعة شاملة للأسواق المالية العالمية والمحلية. تحليل اقتصادي متعمق للاتجاهات والفرص الاستثمارية مع تقييم المخاطر والتوقعات المستقبلية للأسواق.",
    category: "Business",
    host: "سارة الاقتصادية",
    duration: "30 دقيقة",
    published_at: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
  },
  {
    id: "p3",
    title: "رياضة بلا حدود",
    description: "تغطية شاملة للأحداث الرياضية المحلية والعالمية. مقابلات حصرية مع الرياضيين والمدربين وتحليل فني للمباريات والبطولات المهمة.",
    category: "Sports",
    host: "محمد الرياضي",
    duration: "40 دقيقة",
    published_at: new Date(Date.now() - 3 * 24 * 3600_000).toISOString(),
  },
  {
    id: "p4",
    title: "الصحة والعافية",
    description: "برنامج متخصص في الصحة العامة والطب الحديث. نقدم نصائح طبية من خبراء معتمدين ونناقش أحدث العلاجات والاكتشافات الطبية.",
    category: "Health",
    host: "د. فاطمة الطبيبة",
    duration: "35 دقيقة",
    published_at: new Date(Date.now() - 4 * 24 * 3600_000).toISOString(),
  },
  {
    id: "p5",
    title: "السياسة والمجتمع",
    description: "تحليل سياسي معمق للأحداث المحلية والإقليمية والدولية. مناقشات موضوعية حول القضايا المجتمعية المهمة والتطورات السياسية.",
    category: "Politics",
    host: "خالد السياسي",
    duration: "50 دقيقة",
    published_at: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(),
  },
  {
    id: "p6",
    title: "العلوم والاكتشافات",
    description: "رحلة في عالم العلوم والاكتشافات الحديثة. نقدم المعلومات العلمية المعقدة بطريقة مبسطة ومفهومة للجمهور العام مع أحدث البحوث.",
    category: "Science",
    host: "د. يوسف العالم",
    duration: "42 دقيقة",
    published_at: new Date(Date.now() - 6 * 24 * 3600_000).toISOString(),
  },
  {
    id: "p7",
    title: "الترفيه والثقافة",
    description: "استعراض لآخر أخبار الترفيه والفن والثقافة. مقابلات مع النجوم والفنانين ومراجعات للأعمال الفنية الجديدة والأحداث الثقافية المهمة.",
    category: "Entertainment",
    host: "ليلى الفنانة",
    duration: "38 دقيقة",
    published_at: new Date(Date.now() - 7 * 24 * 3600_000).toISOString(),
  },
  {
    id: "p8",
    title: "الطاقة والبيئة",
    description: "برنامج متخصص في قضايا الطاقة المتجددة وحماية البيئة. نناقش الحلول المستدامة والتقنيات الخضراء والسياسات البيئية الفعالة.",
    category: "Energy",
    host: "أمين البيئي",
    duration: "33 دقيقة",
    published_at: new Date(Date.now() - 8 * 24 * 3600_000).toISOString(),
  },
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelected] = useState<string[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(mockItems);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPodcastPlaying, setIsPodcastPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.getFeed();
        if (response && response.items) {
          setNewsItems(response.items);
        }
      } catch (error) {
        console.log("Using mock data as backend is not available");
        // Keep using mock data
      }
    };
    fetchNews();
  }, []);

  const filtered = useMemo(() => {
    if (!selectedCategories.length) return newsItems;
    return newsItems.filter((item) => selectedCategories.includes(item.category || ""));
  }, [selectedCategories, newsItems]);

  // Helper function to stop all speech
  const stopAllSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPodcastPlaying(false);
    setCurrentSpeech(null);
  };

  // Voice/Speech functionality for news
  const handleVoiceToggle = () => {
    if (isPlaying) {
      // Stop current speech
      stopAllSpeech();
    } else {
      // Stop any existing speech first
      stopAllSpeech();
      
      // Start reading all summaries
      const summariesText = filtered.map(item => `${item.title}. ${item.summary}`).join(". Next article: ");
      
      if (!summariesText.trim()) {
        console.warn("No news content to read");
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(summariesText);
      
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.9;
      utterance.lang = 'en-US'; // Set English language explicitly
      
      utterance.onstart = () => {
        console.log("News reading started");
        setIsPlaying(true);
        setIsPodcastPlaying(false);
      };
      utterance.onend = () => {
        console.log("News reading ended");
        setIsPlaying(false);
        setCurrentSpeech(null);
      };
      utterance.onerror = (error) => {
        console.error("News speech error:", error);
        setIsPlaying(false);
        setCurrentSpeech(null);
      };
      
      setCurrentSpeech(utterance);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice/Speech functionality for podcasts
  const handlePodcastVoiceToggle = () => {
    if (isPodcastPlaying) {
      // Stop current speech
      stopAllSpeech();
    } else {
      // Stop any existing speech first
      stopAllSpeech();
      
      // Start reading all podcast descriptions
      const podcastText = podcastMockItems.map(item => `${item.title}. ${item.description}. يقدمه ${item.host}.`).join(". البرنامج التالي: ");
      
      if (!podcastText.trim()) {
        console.warn("No podcast content to read");
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(podcastText);
      
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.9;
      utterance.lang = 'ar'; // Set Arabic language for better pronunciation
      
      utterance.onstart = () => {
        console.log("Podcast reading started");
        setIsPodcastPlaying(true);
        setIsPlaying(false);
      };
      utterance.onend = () => {
        console.log("Podcast reading ended");
        setIsPodcastPlaying(false);
        setCurrentSpeech(null);
      };
      utterance.onerror = (error) => {
        console.error("Podcast speech error:", error);
        setIsPodcastPlaying(false);
        setCurrentSpeech(null);
      };
      
      setCurrentSpeech(utterance);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen">
      <SEO title="PulseFeed – Personalized News Feed" description="Your personalized news feed with intelligent voice narration." />
      <Header />
      <main className="container mx-auto py-6 space-y-6">
        {/* Header Section with Voice Button */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Your Personalized Feed</h1>
            <p className="text-muted-foreground">Stay updated with the latest news from around the world.</p>
          </div>
          <Button 
            onClick={handleVoiceToggle}
            variant={isPlaying ? "destructive" : "default"}
            size="lg"
            className="flex items-center gap-2"
          >
            {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            {isPlaying ? "Stop Reading" : "Read News"}
          </Button>
        </section>

        {/* Category Filter Section */}
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setSelected((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])}
                className="px-3 py-1 rounded-md border text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-white"
                aria-pressed={selectedCategories.includes(c)}
              >
                {selectedCategories.includes(c) ? <Badge variant="secondary">{c}</Badge> : c}
              </button>
            ))}
            {selectedCategories.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelected([])}>Clear All</Button>
            )}
          </div>
        </section>

        {/* News Grid - 4 columns */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <NewsCard 
                key={item.id} 
                item={item} 
                onClick={() => navigate(`/news/${item.id}`)} 
              />
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
          {/* Podcast Header with Voice Button */}
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
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isPodcastPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              {isPodcastPlaying ? "إيقاف القراءة" : "اقرأ البودكاست"}
            </Button>
          </div>

          {/* Podcast Grid - 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {podcastMockItems.map((item) => (
              <PodcastCard 
                key={item.id} 
                item={item} 
                onClick={() => {
                  // Handle podcast click - could navigate to podcast player
                  console.log(`Playing podcast: ${item.title}`);
                }} 
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
