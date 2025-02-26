import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/produkte/${product.id}`}>
      <Card className="hover:shadow-green-400 transition-shadow duration-300">
        <CardContent className="p-4">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.productName}
            width={300}
            height={200}
            className="w-full h-48 object-cover mb-2"
          />
          <h2 className="text-lg font-semibold">{product.productName}</h2>
          <p className="text-sm text-gray-600">{product.manufacturer}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="text-sm font-medium">Verfügbar: {product.stock}</span>
          <span className="text-sm font-medium">{product.condition}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}

