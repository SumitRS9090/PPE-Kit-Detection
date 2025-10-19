import { HardHat, Building2, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const environments = [
  {
    id: "construction",
    name: "Construction",
    icon: HardHat,
    description: "Detect PPE for construction sites",
  },
  {
    id: "office",
    name: "Office",
    icon: Building2,
    description: "Monitor office safety equipment",
  },
  {
    id: "welding",
    name: "Welding",
    icon: Flame,
    description: "Specialized welding PPE detection",
  },
];

interface EnvironmentSelectorProps {
  selected: string;
  onSelect: (env: string) => void;
}

export function EnvironmentSelector({ selected, onSelect }: EnvironmentSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {environments.map((env) => {
        const Icon = env.icon;
        const isSelected = selected === env.id;
        
        return (
          <Card
            key={env.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              isSelected
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => onSelect(env.id)}
          >
            <CardContent className="p-6 text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{env.name}</h3>
              <p className="text-sm text-muted-foreground">{env.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
