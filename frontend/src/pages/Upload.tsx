import { useState, useRef } from "react";
import { Upload as UploadIcon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvironmentSelector } from "@/components/EnvironmentSelector";
import { ResultDisplay } from "@/components/ResultDisplay";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "../services/api";
import { API_BASE } from "../config";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [environment, setEnvironment] = useState("construction");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    imageUrl: string;
    missingItems: string[];
    detectedItems: string[];
  } | null>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedImage(URL.createObjectURL(file));
    setIsProcessing(true);

    try {
      const res = await uploadImage(file, environment);

      setResults({
        imageUrl: res.imageUrl, // Full Cloudinary/Backend URL
        missingItems: res.missingItems,
        detectedItems: res.detectedItems,
      });

      toast({
        title: "Detection Complete",
        description: `Found ${res.detectedItems.length} items, ${res.missingItems.length} missing`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while analyzing image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Image Upload Detection</h1>
            <p className="text-muted-foreground">
              Select an environment and upload an image for PPE detection
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Select Environment</h2>
            <EnvironmentSelector
              selected={environment}
              onSelect={setEnvironment}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {uploadedImage ? "Image Uploaded" : "Click to upload image"}
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG up to 10MB
                </p>
              </div>

              {uploadedImage && !results && (
                <div className="mt-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="max-w-md mx-auto rounded-lg border"
                  />
                </div>
              )}

              {isProcessing && (
                <div className="mt-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-muted-foreground">
                    Processing image...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {results && (
            <ResultDisplay
              imageUrl={results.imageUrl}
              missingItems={results.missingItems}
              detectedItems={results.detectedItems}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
