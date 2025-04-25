export type ProductCondition = "NEUWERTIG" | "KAUM_BENUTZT" | "BENUTZT"
export type ProductCategory = "MONITOR" | "COMPUTER" | "COMPUTERZUSATZ" | "AUDIO" | "DRUCKER"

export const ProductCategories: ProductCategory[] = ["MONITOR", "COMPUTER", "COMPUTERZUSATZ", "AUDIO", "DRUCKER"]
export const ProductConditions: ProductCondition[] = ["NEUWERTIG", "KAUM_BENUTZT", "BENUTZT"]

// Mapping für nutzerfreundliche Anzeige
export const conditionDisplayNames: Record<ProductCondition, string> = {
  NEUWERTIG: "Neuwertig",
  KAUM_BENUTZT: "Kaum benutzt",
  BENUTZT: "Benutzt"
};

export const categoryDisplayNames: Record<ProductCategory, string> = {
  MONITOR: "Monitor",
  COMPUTER: "Computer",
  COMPUTERZUSATZ: "Computerzusatz",
  AUDIO: "Audio",
  DRUCKER: "Drucker"
};

export interface Product {
  id: number
  productName: string
  model: string
  manufacturer: string
  stock: number
  description: string
  images: string[]
  category: ProductCategory
  condition: ProductCondition
}

export const processProductImages = (products: Product[]) => {
    return products.map((product) => {
      if (product.images && product.images.length > 0) {
        const processedImages = product.images.map((img) => {
          if (img.startsWith("data:")) {
            return img;
          } else if (/^[A-Za-z0-9+/=]+$/.test(img)) {
            return `data:image/jpeg;base64,${img}`;
          }
          return img;
        });

        return { ...product, images: processedImages };
      }
      return product;
    });
  };