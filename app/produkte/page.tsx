"use client";

import { useState } from "react";
import Sidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/types";

// Beispiel-Produktdaten
const products: Product[] = [
  {
    id: "1",
    productName: "Laptop XYZ",
    model: "X1",
    manufacturer: "TechCo",
    stock: 10,
    description: "Leistungsstarker Laptop",
    images: ["/laptop.jpg"],
    category: "Computer",
    condition: "Neu",
  },
  {
    id: "2",
    productName: "Drucker ABC",
    model: "A2",
    manufacturer: "IT Solutions",
    stock: 0,
    description: "Gute Drucker",
    images: ["/drucker.jpg"],
    category: "Drucker",
    condition: "Benutzt",
  },
  {
    id: "3",
    productName: "Monitor 123",
    model: "M3",
    manufacturer: "TechCo",
    stock: 5,
    description: "Hochauflösender Monitor",
    images: ["/monitor.jpg"],
    category: "Monitor",
    condition: "Kaum Benutzt",
  },
  {
    id: "4",
    productName: "Tastatur Z",
    model: "T4",
    manufacturer: "IT Solutions",
    stock: 2,
    description: "Farbige Tastatur",
    images: ["/tastatur.jpg"],
    category: "Computerzusatz",
    condition: "Benutzt",
  },
  {
    id: "5",
    productName: "Maus M",
    model: "M5",
    manufacturer: "TechCo",
    stock: 0,
    description: "Ergonomische Maus",
    images: ["/maus.jpg"],
    category: "Computerzusatz",
    condition: "Neu",
  },
  
];

export default function ProductCatalog() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(term) ||
        product.model.toLowerCase().includes(term) ||
        product.manufacturer.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="flex">
      <Sidebar setFilteredProducts={setFilteredProducts} products={products} />
      <main className="flex-1 p-6">
        <Input
          placeholder="Suche..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400 mb-6"        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
