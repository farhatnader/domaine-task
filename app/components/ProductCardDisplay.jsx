import { useState } from "react";

export function ProductCardDisplay({ selectedVariant, secondaryImages, isTouched, handleInteraction }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative max-w-[300px] h-[310px] border-2 border-gray-100 rounded-xl p-4">
      {selectedVariant?.image && (
        <div className="relative w-full h-full" role="button" tabIndex="0"
          onClick={handleInteraction}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleInteraction();
            }
          }}
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}
        >
          <img 
            src={selectedVariant.image.url} 
            alt={selectedVariant.image.altText} 
            className={`w-full h-full object-contain absolute transition-opacity duration-500 ease-in-out ${(isHovered || isTouched) ? "opacity-0" : "opacity-100"}`}
          />
          <img 
            src={secondaryImages[selectedVariant.image.altText].url} 
            alt={selectedVariant.image.altText} 
            className={`w-full h-full object-contain absolute transition-opacity duration-500 ease-in-out ${(isHovered || isTouched) ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      )}

      {selectedVariant?.availableForSale && (
        <div className="absolute top-4 left-4 px-3 py-0 text-red-400 font-semibold border-[1.5px] border-red-400 rounded-3xl">
          On Sale!
        </div>
      )}
    </div>
  )
}