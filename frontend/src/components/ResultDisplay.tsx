import { AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultDisplayProps {
  imageUrl?: string; // Full URL from backend
  missingItems: string[];
  detectedItems: string[];
}

export function ResultDisplay({
  imageUrl,
  missingItems,
  detectedItems,
}: ResultDisplayProps) {
  return (
    <div className="space-y-6">
      {imageUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Detection Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={imageUrl}
              alt="Detection result"
              className="w-full max-w-md mx-auto rounded-lg border shadow-md"
              style={{ objectFit: "contain" }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Detected PPE Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {detectedItems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {detectedItems.map((item, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="border-success text-success"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No items detected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Missing PPE Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {missingItems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingItems.map((item, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="border-destructive text-destructive"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-success font-medium">
                ✓ All required PPE items detected
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
