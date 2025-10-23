import { useState } from "react";
import EnhanceDropdown, { type EnhancementType } from "../EnhanceDropdown";

export default function EnhanceDropdownExample() {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = (type: EnhancementType) => {
    console.log("Enhancing with type:", type);
    setIsEnhancing(true);
    setTimeout(() => setIsEnhancing(false), 2000);
  };

  return (
    <div className="p-4 flex items-center gap-4">
      <EnhanceDropdown onEnhance={handleEnhance} isEnhancing={isEnhancing} />
      <span className="text-sm text-muted-foreground">Icon-only enhance button</span>
    </div>
  );
}
