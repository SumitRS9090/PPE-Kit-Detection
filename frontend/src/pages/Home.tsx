import { Upload, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PPE Detection System
            </h1>
            <p className="text-xl text-muted-foreground">
              Detect and monitor Personal Protective Equipment using AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-primary">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Upload className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Upload Image</CardTitle>
                <CardDescription className="text-base">
                  Upload an image to detect PPE compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate("/upload")}
                  className="w-full"
                  size="lg"
                >
                  Start Detection
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-accent">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all">
                  <Video className="h-8 w-8 text-accent group-hover:text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Live Webcam</CardTitle>
                <CardDescription className="text-base">
                  Real-time PPE detection using your webcam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate("/webcam")}
                  className="w-full bg-accent hover:bg-accent/90"
                  size="lg"
                >
                  Start Webcam
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="text-lg font-semibold mb-2">How it works</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Select your detection method (Upload or Webcam)</li>
              <li>Choose the environment type (Construction, Office, or Welding)</li>
              <li>Get instant feedback on PPE compliance</li>
              <li>View detailed results and missing items</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
