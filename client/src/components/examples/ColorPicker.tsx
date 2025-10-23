import { useState } from "react";
import ColorPicker, { type TaskColor } from "../ColorPicker";

export default function ColorPickerExample() {
  const [color, setColor] = useState<TaskColor>("blue");

  return (
    <div className="p-4">
      <ColorPicker selectedColor={color} onColorChange={setColor} />
      <p className="mt-2 text-sm text-muted-foreground">Selected: {color || "None"}</p>
    </div>
  );
}
