import { Button } from "@/components/ui/button";

export type TaskColor = "purple" | "blue" | "green" | "orange" | "red" | "pink" | null;

interface ColorPickerProps {
  selectedColor: TaskColor;
  onColorChange: (color: TaskColor) => void;
}

const colors: { name: TaskColor; className: string }[] = [
  { name: "purple", className: "bg-task-purple" },
  { name: "blue", className: "bg-task-blue" },
  { name: "green", className: "bg-task-green" },
  { name: "orange", className: "bg-task-orange" },
  { name: "red", className: "bg-task-red" },
  { name: "pink", className: "bg-task-pink" },
];

export default function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {colors.map((color) => (
        <button
          key={color.name}
          data-testid={`button-color-${color.name}`}
          onClick={() => onColorChange(color.name)}
          className={`w-5 h-5 rounded-sm ${color.className} ${
            selectedColor === color.name ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"
          } transition-all`}
          aria-label={`Select ${color.name} color`}
        />
      ))}
      <Button
        variant="ghost"
        size="sm"
        data-testid="button-color-clear"
        onClick={() => onColorChange(null)}
        className="h-5 px-2 text-xs"
      >
        Clear
      </Button>
    </div>
  );
}
