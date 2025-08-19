import { useEffect, useMemo, useState } from "react";

export const useArabicTTS = () => {
  const [ready, setReady] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      const ar = voices.find(v => v.lang?.toLowerCase().startsWith("ar"));
      setVoice(ar || null);
      setReady(true);
    };
    pick();
    if (typeof window !== "undefined") {
      window.speechSynthesis.onvoiceschanged = pick;
    }
  }, []);

  const speak = useMemo(() => (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice?.lang || "ar-SA";
    if (voice) u.voice = voice;
    u.rate = 1.0;
    u.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, [voice]);

  const stop = () => window.speechSynthesis.cancel();

  return { ready, speak, stop, voice };
};
