import type { Product } from "@/lib/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { requestProduct } from "@/app/actions"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { ChevronRight, Package, Factory, Tag, CheckCircle, XCircle, Info } from "lucide-react";
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Dummy-Funktion zum Abrufen von Produktdaten
async function getProduct(id: string): Promise<Product> {
  // In einer echten Anwendung würden Sie hier die Daten aus einer API oder Datenbank abrufen
  return {
    id,
    productName: "Beispielprodukt",
    model: "XYZ-123",
    manufacturer: "ACME Corp",
    stock: 10,
    description: "Dies ist ein Beispielprodukt mit einer ausführlichen Beschreibung.",
    images: ["/placeholder.svg"],
    category: "Computer",
    condition: "Neu",
  }
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  const session = await getServerSession()

  if (!session) {
    redirect("/produkte")
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
            <Badge className="mb-3">{product.category}</Badge>
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
                <p className="text-muted-foreground">{product.category}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Zustand</p>
                <p className="text-muted-foreground">{product.condition}</p>
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

          <form action={requestProduct} className="mt-8">
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

