"use client"
import { useState, useEffect } from "react"
import { Product, processProductImages, categoryDisplayNames, conditionDisplayNames } from "@/lib/types";
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Package, Factory, Tag, CheckCircle, XCircle, Info } from "lucide-react"
import Link from "next/link"

export default function ProductDetails({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8050/products/${params.id}`, {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        })
        if (!response.ok) throw new Error("Fehler beim Laden des Produkts")
        const data: Product = await response.json()
        const processedProduct = processProductImages([data])[0]
        setProduct(processedProduct)
      } catch (error) {
        console.error("Fehler beim Laden:", error)
      }
    }

    fetchProduct()
  }, [params.id])

  if (!session) {
    redirect("/produkte")
  }

  if (!product) {
    return <div className="text-center mt-10 text-gray-500">Produkt wird geladen...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Image */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video md:aspect-[4/3] lg:aspect-square w-full h-[700px]">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.productName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-3 bg-green-500">{product.category}</Badge>
            <h1 className="text-3xl font-bold tracking-tight">{product.productName}</h1>
            <p className="text-muted-foreground mt-2">
              {product.stock > 0 ? (
                <span className="flex items-center text-custom-green">
                  <CheckCircle className="h-4 w-4 mr-1" />{product.stock} verfügbar
                </span>
              ) : (
                <span className="flex items-center text-red-500">
                  <XCircle className="h-4 w-4 mr-1" />Nicht verfügbar
                </span>
              )}
            </p>
          </div>

          <Separator />
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Modell</p>
                <p className="text-muted-foreground">{product.model}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Factory className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Hersteller</p>
                <p className="text-muted-foreground">{product.manufacturer}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Kategorie</p>
                <p className="text-muted-foreground">{categoryDisplayNames[product.category]}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Zustand</p>
                <p className="text-muted-foreground">{conditionDisplayNames[product.condition]}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-start gap-3 mb-2">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="font-medium">Beschreibung</p>
            </div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <form action={""} className="mt-8">
            <input type="hidden" name="productId" value={product.id} />
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="lg"
              disabled={product.stock === 0}
            >
              Produkt anfragen
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
