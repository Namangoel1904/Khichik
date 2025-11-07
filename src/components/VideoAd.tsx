import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";

export const VideoAd = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-12 md:py-16" aria-label="Promo Video">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`max-w-5xl mx-auto ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} transition-all duration-700 ease-out`}
        >
          <Card className="overflow-hidden rounded-2xl shadow-card bg-card/50 backdrop-blur-sm">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={encodeURI("/Ad.mp4")}
                playsInline
                preload="metadata"
                poster={encodeURI("/Screenshot 2025-11-07 153031.png")}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={() => {
                  const v = videoRef.current;
                  if (v) setDuration(v.duration || 0);
                }}
                onTimeUpdate={() => {
                  const v = videoRef.current;
                  if (v) setCurrentTime(v.currentTime || 0);
                }}
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  if (v.paused) {
                    v.muted = false;
                    v.volume = 1;
                    v.play().catch(() => {});
                  } else {
                    v.pause();
                  }
                }}
              />
              {!isPlaying && (
              <button
                type="button"
                aria-label="Play"
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  v.muted = false;
                  v.volume = 1;
                  v.play().catch(() => {});
                }}
                className="absolute inset-0 m-auto flex items-center justify-center w-16 h-16 rounded-full bg-background/70 backdrop-blur border border-border/50 shadow-card hover:scale-105 transition-transform"
                style={{ top: 0, bottom: 0, left: 0, right: 0 }}
              >
                <Play className="h-7 w-7 text-foreground" />
              </button>
              )}
              {/* Seek slider */}
              <div className="absolute left-0 right-0 bottom-2 px-4">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Number.isFinite(currentTime) ? currentTime : 0}
                  onChange={(e) => {
                    const v = videoRef.current;
                    if (!v) return;
                    const t = parseFloat(e.target.value);
                    v.currentTime = isNaN(t) ? 0 : t;
                    setCurrentTime(v.currentTime);
                  }}
                  className="w-full appearance-none h-1 bg-primary/40 rounded outline-none [::-webkit-slider-thumb]:appearance-none [::-webkit-slider-thumb]:w-3 [::-webkit-slider-thumb]:h-3 [::-webkit-slider-thumb]:rounded-full [::-webkit-slider-thumb]:bg-primary [::-moz-range-thumb]:w-3 [::-moz-range-thumb]:h-3 [::-moz-range-thumb]:rounded-full [::-moz-range-thumb]:bg-primary"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};


