"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

interface Product {
  id: string;
  productName: string;
  model: string;
  manufacturer: string;
  category: string;
  condition: string;
  description: string;
  stock: string;
  images: File[];
}

export function EditProductForm({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8050/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Fehler beim Laden des Produkts. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
    };

    if (session) {
      fetchProduct();
    }
  }, [productId, session, toast]);

  const handleChange = (key: keyof Product, value: string | File[]) => {
    if (product) {
      setProduct({
        ...product,
        [key]: value,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Sicherstellen, dass alle Felder gültig sind
    if (!product) return;

    try {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file) => formData.append("images", file));
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await fetch(`http://localhost:8050/products/update/${productId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Fehler beim Aktualisieren des Produkts");

      toast({
        title: "Erfolg",
        description: "Produkt erfolgreich aktualisiert.",
      });

      router.push("/meineprodukte");
    } catch (error) {
      setError("Fehler beim Aktualisieren des Produkts. Bitte versuchen Sie es erneut.");
    }
  };

  if (!product) {
    return <div>Laden...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap -mx-4">
        {/* Left Column */}
        <div className="w-full lg:w-1/2 px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Produkt Name</Label>
            <Input
              id="productName"
              value={product.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Produkt Modell</Label>
            <Input
              id="model"
              value={product.model}
              onChange={(e) => handleChange("model", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Hersteller</Label>
            <Input
              id="manufacturer"
              value={product.manufacturer}
              onChange={(e) => handleChange("manufacturer", e.target.value)}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2 px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select
              value={product.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Bitte wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kategorien</SelectLabel>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Computer">Computer</SelectItem>
                  <SelectItem value="Computerzusatz">Computerzusatz</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                  <SelectItem value="Drucker">Drucker</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Zustand</Label>
            <Select
              value={product.condition}
              onValueChange={(value) => handleChange("condition", value)}
            >
              <SelectTrigger id="condition" className="w-full">
                <SelectValue placeholder="Bitte wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Zustand auswählen</SelectLabel>
                  <SelectItem value="Neu">Neu</SelectItem>
                  <SelectItem value="Kaum Benutzt">Kaum Benutzt</SelectItem>
                  <SelectItem value="Benutzt">Benutzt</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={product.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Bilder hochladen</Label>
            <Input
              id="images"
              type="file"
              multiple
              onChange={(e) =>
                handleChange("images", Array.from(e.target.files || []))
              }
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <p>{error}</p>
        </div>
      )}

      <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
        Produkt aktualisieren
      </Button>
    </form>
  );
}
