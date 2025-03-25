import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Product, conditionDisplayNames } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/produkte/${product.id}`}>
      <Card className="h-full hover:shadow-green-400 transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="relative w-full h-48 mb-2">
            {product.images && product.images.length > 0 ? (
              product.images[0].startsWith("data:") ? (
                // For base64 encoded images
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.productName}
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                />
              ) : (
                // For regular URL images
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.productName}
                  fill
                  className="object-cover rounded-md"
                />
              )
            ) : (
              <Image src="/placeholder.svg" alt={product.productName} fill className="object-cover rounded-md" />
            )}
          </div>
          <h2 className="text-lg font-semibold truncate">{product.productName}</h2>
          <p className="text-sm text-gray-600">{product.manufacturer}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-gray-50 rounded-b-lg">
          <span className="text-sm font-medium">Verfügbar: {product.stock}</span>
          <span className="text-sm font-medium">{conditionDisplayNames[product.condition]}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}

