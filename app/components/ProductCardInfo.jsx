import { Money } from "@shopify/hydrogen"

export function ProductCardInfo({ vendor, title, selectedVariant }) {
  return (
    <div className="mt-3">
      <div className="text-gray-600 text-sm tracking-tighter font-semibold">{vendor}</div>
      <div className="text-blue-800 text-md tracking-tight font-semibold">{title}</div>
      
      <div className="flex space-x-4 font-medium">
        {selectedVariant.compareAtPrice && (
          <div className="inline-block text-gray-600"><s><Money data={selectedVariant.compareAtPrice} /></s></div>
        )}
        <div className="inline-block text-red-500"><Money data={selectedVariant.price} /></div>
      </div>
    </div>
  )
}