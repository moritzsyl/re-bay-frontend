import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Product, conditionDisplayNames } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { Package, ShoppingCart } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {

  return (
    <Link href={`/produkte/${product.id}`} className="block h-full">
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] group flex flex-col">
        <div className="relative">
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="flex items-center bg-gray-500 text-white">
              {conditionDisplayNames[product.condition]}
            </Badge>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <Image
              src={product.images[0] || "/placeholder.svg?height=300&width=400"}
              alt={product.productName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
          </div>
        </div>

        <CardContent className="p-4 flex-grow">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-muted-foreground">
              {product.manufacturer} • {product.model}
            </div>
            <Badge variant="secondary" className="text-xs bg-green-500 text-white">
              {product.category}
            </Badge>
          </div>

          <h2 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.productName}
          </h2>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
        </CardContent>

        <CardFooter className="p-4 pt-3 flex justify-between items-center border-t mt-auto">
          <div className="flex items-center text-sm">
            <Package className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span
              className={`font-medium ${product.stock > 0 ? "text-green-500 dark:text-green-500" : "text-destructive"}`}
            >
              {product.stock > 0 ? `${product.stock} verfügbar` : "Nicht verfügbar"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
