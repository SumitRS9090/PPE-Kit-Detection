import { useState, useRef, useEffect } from "react";
import { Video, ArrowLeft, Play, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvironmentSelector } from "@/components/EnvironmentSelector";
import { ResultDisplay } from "@/components/ResultDisplay";
import { useToast } from "@/hooks/use-toast";
import { API_BASE } from "../config";

const Webcam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number | null>(null);

  const [environment, setEnvironment] = useState("construction");
  const [isStreaming, setIsStreaming] = useState(false);
  const [annotatedFrame, setAnnotatedFrame] = useState<string | null>(null);
  const [results, setResults] = useState<{
    missingItems: string[];
    detectedItems: string[];
  } | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopWebcam();
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // 💡 Explicitly play the video. This is more reliable than autoPlay.
        await videoRef.current.play();

        setIsStreaming(true);
        setAnnotatedFrame(null);
        setResults(null);

        requestRef.current = requestAnimationFrame(processFrame);

        toast({
          title: "Webcam Started",
          description: "Live PPE detection is active",
        });
      }
    } catch (error) {
      console.error("Failed to start webcam:", error);
      toast({
        title: "Camera Error",
        description: "Could not access or play webcam feed. Check permissions.",
        variant: "destructive",
      });
      setIsStreaming(false); // Ensure state is correct on failure
    }
  };

  const stopWebcam = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setAnnotatedFrame(null);
    setResults(null);
  };

  const processFrame = async () => {
    // 💡 A more robust check to ensure the video is ready and has dimensions
    if (
      !videoRef.current ||
      videoRef.current.paused ||
      videoRef.current.ended ||
      videoRef.current.videoWidth === 0
    ) {
      // If we are still supposed to be streaming, try again on the next frame
      if (videoRef.current && videoRef.current.srcObject) {
        requestRef.current = requestAnimationFrame(processFrame);
      }
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frameBase64 = canvas.toDataURL("image/jpeg");

    try {
      const res = await fetch(`${API_BASE}/webcam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame: frameBase64, environment }),
      });
      const data = await res.json();

      if (data && !data.error) {
        setAnnotatedFrame(data.annotatedFrame);
        setResults({
          missingItems: data.missingItems,
          detectedItems: data.detectedItems,
        });
      }
    } catch (err) {
      console.error("Webcam detection error:", err);
    } finally {
      if (videoRef.current && videoRef.current.srcObject) {
        requestRef.current = requestAnimationFrame(processFrame);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>

        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold mb-2">Live Webcam Detection</h1>
          <p className="text-muted-foreground mb-4">
            Real-time PPE detection using your webcam
          </p>

          <EnvironmentSelector
            selected={environment}
            onSelect={setEnvironment}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Video className="h-5 w-5" /> Webcam Feed
                </span>
                <div className="flex gap-2">
                  {!isStreaming ? (
                    <Button onClick={startWebcam}>
                      <Play className="h-4 w-4 mr-2" /> Start Webcam
                    </Button>
                  ) : (
                    <Button onClick={stopWebcam} variant="destructive">
                      <Square className="h-4 w-4 mr-2" /> Stop Webcam
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                {/* --- 💡 START OF CHANGES --- */}
                {/* This video is our hidden data source. We position it off-screen. */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    position: "absolute",
                    top: "-9999px",
                    left: "-9999px",
                  }}
                />
                {/* ---  END OF CHANGES  --- */}

                {isStreaming ? (
                  annotatedFrame ? (
                    <img
                      src={annotatedFrame}
                      alt="Annotated Frame"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-70">
                      <p>Loading feed...</p>
                    </div>
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white opacity-70">
                    <p>Webcam not active</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {results && (
            <ResultDisplay
              missingItems={results.missingItems}
              detectedItems={results.detectedItems}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Webcam;
