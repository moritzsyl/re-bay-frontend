"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"
import MyProductCard from "@/components/MyProductCard"

export default function MyProductsGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchProducts()
    }
  }, [session])

  const processProductImages = (products: Product[]) => {
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

  // Wird beim laden der Seite aufgerufen
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8050/products/all", {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      // Process the images before setting the state
      const processedData = processProductImages(data)
      setProducts(processedData)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  // Wird bei einem Klick auf Löschen im Kontext Dropdown Menü eines Produkts aufgerufen
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8050/products/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to delete product")
      }
      setProducts(products.filter((product) => product.id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => router.push("/produkte/hinzufuegen")}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Neues Produkt hinzufügen
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Keine Produkte gefunden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <MyProductCard product={product} />
              <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Aktionen</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault()
                        router.push(`meineprodukte/bearbeiten/${product.id}`)
                      }}
                    >
                      Bearbeiten
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault()
                        handleDelete(product.id)
                      }}
                    >
                      Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

