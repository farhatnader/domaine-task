import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { ProductCardDisplay } from "~/components/ProductCardDisplay";
import { ProductCardColorSwatches } from "~/components/ProductCardColorSwatches";
import { ProductCardInfo } from "~/components/ProductCardInfo";

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

  // to consider: create an object to map color to variant instead
  const colors = [...new Set(variants.map(variant => {
    const colorOption = variant.selectedOptions.find(opt => opt.name.toLowerCase() === "color");
    return colorOption ? colorOption.value : null;
  }).filter(Boolean))];

  // initialize with default color, and select corresponding variant
  // to consider: query for default variant, and just use that instead
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedVariant, setSelectedVariant] = useState(
    variants.find(variant =>  
      variant.selectedOptions.some(opt => opt.name.toLowerCase() === "color" && opt.value === selectedColor)
    )
  );

  // find the variant node whose color matches selected color, set as selected variant
  const selectVariant = (color) => {
    const selection = variants.find(variant =>  
      variant.selectedOptions.some(opt => opt.name.toLowerCase() === "color" && opt.value === color)
    )
    setSelectedVariant(selection);
    setSelectedColor(color);
  }

  // for touch interaction, alternating image in place of hover
  const [isTouched, setIsTouched] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);
  const handleInteraction = () => {
    if (isTouchDevice) {
      setIsTouched(!isTouched);
    }
  };

  return (
    <div className="mt-5">
      <ProductCardDisplay selectedVariant={selectedVariant} secondaryImages={secondaryImages} isTouched={isTouched} handleInteraction={handleInteraction} />
      <ProductCardColorSwatches colors={colors} selectedColor={selectedColor} selectVariant={selectVariant} setIsTouched={setIsTouched} />
      <ProductCardInfo vendor={product?.vendor} title={product?.title} selectedVariant={selectedVariant} />
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
