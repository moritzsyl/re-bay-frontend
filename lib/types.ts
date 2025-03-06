export type ProductCondition = "NEUWERTIG" | "KAUM_BENUTZT" | "BENUTZT"

export type ProductCategory = "MONITOR" | "COMPUTER" | "COMPUTERZUSATZ" | "AUDIO" | "DRUCKER"
export const ProductCategories: ProductCategory[] = ["MONITOR", "COMPUTER", "COMPUTERZUSATZ", "AUDIO", "DRUCKER"]
export const ProductConditions: ProductCondition[] = ["NEUWERTIG", "KAUM_BENUTZT", "BENUTZT"]
export interface Product {
  id: string
  productName: string
  model: string
  manufacturer: string
  stock: number
  description: string
  images: string[]
  category: ProductCategory
  condition: ProductCondition
}

