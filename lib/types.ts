export type ProductCondition = "Neu" | "Kaum Benutzt" | "Benutzt"

export type ProductCategory = "Monitor" | "Computer" | "Computerzusatz" | "Audio" | "Drucker"

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

