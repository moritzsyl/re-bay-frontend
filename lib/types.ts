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