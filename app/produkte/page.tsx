"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/CatalogProductCard";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/types";

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8050/products/catalog");
        if (!response.ok) throw new Error("Fehler beim Laden der Produkte");
        const data: Product[] = await response.json();
        const processedData = processProductImages(data);
        setProducts(processedData);
        setFilteredProducts(processedData);
      } catch (error) {
        console.error("Fehler:", error);
      }
    };

    fetchProducts();
  }, []);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProducts(
      products.filter(
        (product) =>
          product.productName.toLowerCase().includes(term) ||
          product.model.toLowerCase().includes(term) ||
          product.manufacturer.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div className="flex">
      <Sidebar setFilteredProducts={setFilteredProducts} products={products} />
      <main className="flex-1 p-6">
        <Input
          placeholder="Suche..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400 mb-6"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <p className="text-gray-500">Keine Produkte gefunden.</p>
          )}
        </div>
      </main>
    </div>
  );
}
