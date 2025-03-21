
export function ProductCardColorSwatches({ colors, selectedColor, selectVariant }) {
  return (
    <div className="flex gap-2 mt-4">
      {colors.map(color => (
        <button
          key={color}
          onClick={() => selectVariant(color)}
          className={`w-5 h-5 cursor-pointer rounded-full transition-transform duration-200 ease-in-out ${
            selectedColor === color ? 'outline outline-3 outline-offset-0 outline-blue-300' : 'hover:scale-110'
          }`}
          style={{ backgroundColor: color.toLowerCase() }}
        ></button>
      ))}
    </div>
  )
}