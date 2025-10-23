import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Loader2 } from "lucide-react";

export type EnhancementType = "general" | "spec" | "bug" | "prompt";

interface EnhanceDropdownProps {
  onEnhance: (type: EnhancementType) => void;
  isEnhancing?: boolean;
}

const enhancementOptions = [
  { type: "general" as EnhancementType, label: "Enhance Text", description: "Improve clarity and grammar" },
  { type: "spec" as EnhancementType, label: "Enhance for Spec", description: "Format as technical specification" },
  { type: "bug" as EnhancementType, label: "Enhance for Bug Report", description: "Structure as bug report" },
  { type: "prompt" as EnhancementType, label: "Enhance for Prompt", description: "Optimize as AI prompt" },
];

export default function EnhanceDropdown({ onEnhance, isEnhancing = false }: EnhanceDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleEnhance = (type: EnhancementType) => {
    onEnhance(type);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          disabled={isEnhancing}
          data-testid="button-enhance"
          className="gap-2"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Enhance
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {enhancementOptions.map((option) => (
          <DropdownMenuItem
            key={option.type}
            onClick={() => handleEnhance(option.type)}
            data-testid={`menu-item-enhance-${option.type}`}
            className="flex flex-col items-start gap-1"
          >
            <span className="font-medium">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
