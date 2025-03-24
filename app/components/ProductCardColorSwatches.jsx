
export function ProductCardColorSwatches({ colors, selectedColor, selectVariant, setIsTouched }) {
  return (
    <div className="flex gap-2 mt-4">
      {colors.map(color => (
        <button
          key={color}
          onClick={() => { selectVariant(color); setIsTouched(false); }}
          className={`w-5 h-5 cursor-pointer overflow-visible rounded-full ${
            selectedColor === color ? 'overflow-visible ring-1 ring-offset-1 ring-blue-800 scale-110 origin-center' : 'hover:scale-110 origin-center'
          }`}
          style={{ backgroundColor: color.toLowerCase() }}
        ></button>
      ))}
    </div>
  )
}