import {
  ArrowLeft,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Performance = () => {
  const navigate = useNavigate();

  const metrics = [
    {
      label: "Overall Accuracy",
      value: 97.63,
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Detection Speed",
      value: 85,
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10",
      suffix: "ms avg",
    },
    {
      label: "Precision",
      value: 96.35,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Recall",
      value: 94.7,
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const classMetrics = [
    { name: "Vest", precision: 93.1, recall: 91.5, f1Score: 92.3 },
    { name: "Helmet", precision: 96.2, recall: 94.8, f1Score: 95.5 },
    { name: "Shoes", precision: 88.9, recall: 87.2, f1Score: 88.0 },
    { name: "Gloves", precision: 91.4, recall: 89.6, f1Score: 90.5 },
    { name: "Googles", precision: 94.7, recall: 92.3, f1Score: 93.5 },
    { name: "Mask", precision: 97.1, recall: 95.8, f1Score: 96.4 },
    { name: "Earplug", precision: 87.1, recall: 88.3, f1Score: 89.2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Model Performance</h1>
            <p className="text-muted-foreground">
              YOLOv8 PPE Detection Model Metrics and Statistics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label}>
                  <CardHeader className="pb-3">
                    <div
                      className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center mb-2`}
                    >
                      <Icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      {metric.value}
                      {metric.suffix ? (
                        <span className="text-base font-normal text-muted-foreground ml-1">
                          {metric.suffix}
                        </span>
                      ) : (
                        "%"
                      )}
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Per-Class Performance Metrics</CardTitle>
              <CardDescription>
                Detailed performance breakdown for each PPE item class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {classMetrics.map((item) => (
                  <div key={item.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        F1: {item.f1Score}%
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-muted-foreground">
                            Precision
                          </span>
                          <span className="font-medium">{item.precision}%</span>
                        </div>
                        <Progress value={item.precision} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-muted-foreground">Recall</span>
                          <span className="font-medium">{item.recall}%</span>
                        </div>
                        <Progress value={item.recall} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-muted-foreground">
                            F1-Score
                          </span>
                          <span className="font-medium">{item.f1Score}%</span>
                        </div>
                        <Progress value={item.f1Score} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Architecture</span>
                  <span className="font-medium">YOLOv8n</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Input Size</span>
                  <span className="font-medium">640x640</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parameters</span>
                  <span className="font-medium">11.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">FLOPs</span>
                  <span className="font-medium">28.6 GFLOPs</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dataset Size</span>
                  <span className="font-medium">4000 Images</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Epochs</span>
                  <span className="font-medium">50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch Size</span>
                  <span className="font-medium">16</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Optimizer</span>
                  <span className="font-medium">AdamW</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
