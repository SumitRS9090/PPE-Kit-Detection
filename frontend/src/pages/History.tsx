import { ArrowLeft, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const History = () => {
  const navigate = useNavigate();

  const historyData = [
    {
      id: "DET-001",
      timestamp: "2025-01-15 14:30:22",
      environment: "Construction",
      method: "Image Upload",
      status: "violations",
      detected: ["Hard Hat", "Safety Vest"],
      missing: ["Safety Boots", "Gloves"],
    },
    {
      id: "DET-002",
      timestamp: "2025-01-15 13:15:45",
      environment: "Welding",
      method: "Webcam",
      status: "compliant",
      detected: ["Welding Helmet", "Gloves", "Apron", "Safety Boots"],
      missing: [],
    },
    {
      id: "DET-003",
      timestamp: "2025-01-15 12:05:10",
      environment: "Office",
      method: "Image Upload",
      status: "violations",
      detected: ["Fire Extinguisher"],
      missing: ["First Aid Kit", "Emergency Exit Sign"],
    },
    {
      id: "DET-004",
      timestamp: "2025-01-15 11:20:33",
      environment: "Construction",
      method: "Webcam",
      status: "compliant",
      detected: ["Hard Hat", "Safety Vest", "Safety Boots", "Gloves", "Safety Glasses"],
      missing: [],
    },
    {
      id: "DET-005",
      timestamp: "2025-01-15 10:45:18",
      environment: "Welding",
      method: "Image Upload",
      status: "violations",
      detected: ["Welding Helmet", "Gloves"],
      missing: ["Apron", "Respirator"],
    },
    {
      id: "DET-006",
      timestamp: "2025-01-15 09:30:55",
      environment: "Construction",
      method: "Image Upload",
      status: "violations",
      detected: ["Hard Hat"],
      missing: ["Safety Vest", "Safety Boots", "Gloves", "Safety Glasses"],
    },
    {
      id: "DET-007",
      timestamp: "2025-01-14 16:20:40",
      environment: "Office",
      method: "Webcam",
      status: "compliant",
      detected: ["Fire Extinguisher", "First Aid Kit", "Emergency Exit Sign"],
      missing: [],
    },
    {
      id: "DET-008",
      timestamp: "2025-01-14 15:10:25",
      environment: "Welding",
      method: "Webcam",
      status: "violations",
      detected: ["Welding Helmet", "Safety Boots"],
      missing: ["Gloves", "Apron", "Respirator"],
    },
  ];

  const stats = {
    total: historyData.length,
    compliant: historyData.filter((d) => d.status === "compliant").length,
    violations: historyData.filter((d) => d.status === "violations").length,
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

        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Detection History</h1>
            <p className="text-muted-foreground">
              Historical records of PPE detection events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Detections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Compliant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.compliant}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {((stats.compliant / stats.total) * 100).toFixed(1)}% compliance rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.violations}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {((stats.violations / stats.total) * 100).toFixed(1)}% violation rate
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Detections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Detected Items</TableHead>
                      <TableHead>Missing Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {record.timestamp}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.environment}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{record.method}</TableCell>
                        <TableCell>
                          {record.status === "compliant" ? (
                            <Badge className="bg-success text-success-foreground">
                              Compliant
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Violations</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {record.detected.map((item, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.missing.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {record.missing.map((item, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs border-destructive text-destructive"
                                >
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-success">All detected</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default History;
