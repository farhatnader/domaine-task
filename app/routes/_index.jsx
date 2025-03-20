import { useLoaderData } from "@remix-run/react";
import { useState } from 'react';
import { Money } from "@shopify/hydrogen";

export const loader = async ({ context }) => {
  const handle = 't-shirt';
  const data = await context.storefront.query(PRODUCT_QUERY, { variables: { handle } });
  return data;
};

export default function ProductPage() {
  const data = useLoaderData();
  const product = data?.productByHandle;

  
  const variants = product?.variants?.nodes || [];
  const secondaryImages = product?.images?.nodes?.reduce((acc, image) => {
    if (image.altText?.toLowerCase().includes('-secondary')) {
      acc[image.altText.split('-')[0]] = image;
    }
    return acc;
  }, {});

  const colors = [...new Set(variants.map(variant => {
    const colorOption = variant.selectedOptions.find(opt => opt.name.toLowerCase() === "color");
    return colorOption ? colorOption.value : null;
  }).filter(Boolean))];

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedVariant, setSelectedVariant] = useState(
    variants.find(variant =>  
      variant.selectedOptions.some(opt => opt.name.toLowerCase() === "color" && opt.value === selectedColor)
    )
  );
  const [imgSrc, setImgSrc] = useState(selectedVariant.image.url);

  const selectVariant = (color) => {
    const selection = variants.find(variant =>  
      variant.selectedOptions.some(opt => opt.name.toLowerCase() === "color" && opt.value === color)
    )
    setSelectedVariant(selection);
    setImgSrc(selection.image.url);
    setSelectedColor(color);
  }

  return (
    <div className="mt-5">
      <div className="relative max-w-[300px] h-[330px] border-2 border-gray-100 rounded-xl p-4">
        {selectedVariant?.availableForSale && (
          <div className="absolute top-4 left-4 px-3 py-0 text-red-500 font-bold border-2 border-red-500 rounded-3xl">
            On Sale!
          </div>
        )}

        {selectedVariant?.image && (
          <img 
            src={imgSrc} 
            alt={selectedVariant.image.altText} 
            className="w-full h-full object-contain"
            onMouseEnter={() => setImgSrc(secondaryImages[selectedVariant.image.altText].url)}
            onMouseLeave={() => setImgSrc(selectedVariant.image.url)}
          />
        )}
      </div>

      <div className="flex gap-2 mt-4">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => selectVariant(color)}
            className={`w-5 h-5 cursor-pointer rounded-full ${
              selectedColor === color ? 'outline outline-2 outline-offset-1 outline-blue-300' : ''
            }`}
            style={{ backgroundColor: color.toLowerCase() }}
          ></button>
        ))}
      </div>

      <div className="mt-3 font-">
        <div className="text-gray-600 text-sm tracking-tighter font-semibold">{product?.vendor}</div>
        <div className="text-blue-800 text-md tracking-tight font-semibold">{product?.title}</div>
        
        <div className="flex space-x-4 font-semibold">
          {selectedVariant.compareAtPrice && (
            <div className="inline-block text-gray-600"><s><Money data={selectedVariant.compareAtPrice} /></s></div>
          )}
          <div className="inline-block text-red-700"><Money data={selectedVariant.price} /></div>
        </div>
      </div>

    </div>
  );
}

const PRODUCT_QUERY = `#graphql
  query getProductWithVariantsAndImages($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      vendor
      images(first: 20) {     
        nodes {
          id
          url
          altText
        }
      }
      variants(first: 20) {
        nodes {
          availableForSale
          compareAtPrice {
            amount
            currencyCode
          }
          price {
            amount
            currencyCode
          }
          id
          title
          image {
            url
            altText
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
