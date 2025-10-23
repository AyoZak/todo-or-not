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
    <div className="p-4">
      <EnhanceDropdown onEnhance={handleEnhance} isEnhancing={isEnhancing} />
    </div>
  );
}
