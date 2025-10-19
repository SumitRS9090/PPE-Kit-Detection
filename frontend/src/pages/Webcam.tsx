import { useState, useRef, useEffect } from "react";
import { Video, ArrowLeft, Play, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvironmentSelector } from "@/components/EnvironmentSelector";
import { ResultDisplay } from "@/components/ResultDisplay";
import { useToast } from "@/hooks/use-toast";

const Webcam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [environment, setEnvironment] = useState("construction");
  const [isStreaming, setIsStreaming] = useState(false);
  const [results, setResults] = useState<{
    missingItems: string[];
    detectedItems: string[];
  } | null>(null);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        
        // Simulate continuous detection
        const interval = setInterval(() => {
          const mockResults = {
            construction: {
              detectedItems: ["Hard Hat", "Safety Vest", "Gloves"],
              missingItems: ["Safety Boots"],
            },
            office: {
              detectedItems: ["Fire Extinguisher", "First Aid Kit"],
              missingItems: [],
            },
            welding: {
              detectedItems: ["Welding Helmet", "Gloves", "Apron"],
              missingItems: ["Respirator"],
            },
          };

          const envResults = mockResults[environment as keyof typeof mockResults];
          setResults(envResults);
        }, 3000);

        // Store interval ID for cleanup
        (videoRef.current as any).detectionInterval = interval;

        toast({
          title: "Webcam Started",
          description: "Real-time PPE detection is now active",
        });
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access webcam. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopWebcam = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      
      // Clear detection interval
      if ((videoRef.current as any).detectionInterval) {
        clearInterval((videoRef.current as any).detectionInterval);
      }
      
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setResults(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Live Webcam Detection</h1>
            <p className="text-muted-foreground">
              Real-time PPE detection using your webcam
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Select Environment</h2>
            <EnvironmentSelector
              selected={environment}
              onSelect={(env) => {
                setEnvironment(env);
                if (isStreaming) {
                  setResults(null);
                }
              }}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Webcam Feed
                </span>
                <div className="flex gap-2">
                  {!isStreaming ? (
                    <Button onClick={startWebcam}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Webcam
                    </Button>
                  ) : (
                    <Button onClick={stopWebcam} variant="destructive">
                      <Square className="h-4 w-4 mr-2" />
                      Stop Webcam
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Webcam not active</p>
                      <p className="text-sm opacity-70">Click "Start Webcam" to begin</p>
                    </div>
                  </div>
                )}
                {isStreaming && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
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
