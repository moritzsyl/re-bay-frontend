import type { Product } from "@/lib/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { requestProduct } from "@/app/actions"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.productName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.productName}
            width={500}
            height={300}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div>
          <p className="text-lg mb-2">
            <strong>Modell:</strong> {product.model}
          </p>
          <p className="text-lg mb-2">
            <strong>Hersteller:</strong> {product.manufacturer}
          </p>
          <p className="text-lg mb-2">
            <strong>Verfügbar:</strong> {product.stock}
          </p>
          <p className="text-lg mb-2">
            <strong>Kategorie:</strong> {product.category}
          </p>
          <p className="text-lg mb-2">
            <strong>Zustand:</strong> {product.condition}
          </p>
          <p className="text-lg mb-4">
            <strong>Beschreibung:</strong> {product.description}
          </p>
          <form action={requestProduct}>
            <input type="hidden" name="productId" value={product.id} />
            <Button type="submit" className="w-full">
              Anfragen
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

