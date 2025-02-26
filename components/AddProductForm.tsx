"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Product, ProductCategory, ProductCondition } from "@/lib/types";

export default function ProductForm() {
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product>({
    id: "",
    productName: "",
    model: "",
    manufacturer: "",
    stock: 0,
    description: "",
    category: "" as ProductCategory,
    condition: "" as ProductCondition,
    images: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof Product, string>>>(
    {}
  );

  const productCategories: ProductCategory[] = [
    "Monitor",
    "Computer",
    "Computerzusatz",
    "Audio",
    "Drucker",
  ];

  const productConditions: ProductCondition[] = ["Neu", "Kaum Benutzt", "Benutzt"];

  const validateField = (key: keyof Product, value: string | number | string[] | undefined) => {
    let error = "";
    if (!value || (typeof value === "string" && !value.trim())) {
      error = `${key} ist erforderlich`;
    } else if (key === "stock" && isNaN(Number(value))) {
      error = "Stückzahl muss eine Zahl sein";
    }
    setValidationErrors((prev) => ({ ...prev, [key]: error }));
    return !error;
  };

  const handleChange = (key: keyof Product, value: string | number | string[]) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const base64Images = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );
    setProduct((prev) => ({ ...prev, images: base64Images }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const isValid = Object.keys(product).every((key) => {
      const value = product[key as keyof Product];
      return validateField(key as keyof Product, value);
    });

    if (!isValid || !session) {
      if (!session) setError("Sie müssen angemeldet sein, um ein Produkt hinzuzufügen.");
      return;
    }

    if (!product.images || product.images.length === 0) {
      setError("Bitte fügen Sie mindestens ein Bild hinzu.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "product",
        JSON.stringify({
          productName: product.productName,
          model: product.model,
          manufacturer: product.manufacturer,
          stock: product.stock,
          description: product.description,
          category: product.category,
          condition: product.condition,
        })
      );
      product.images.forEach((file) => {
        formData.append("productImages", file);
      });

      const response = await fetch("http://localhost:8050/products/add", {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Fehler beim Hinzufügen des Produkts");

      console.log("Produkt erfolgreich hinzugefügt");
    } catch (error) {
      setError("Fehler beim Hinzufügen des Produkts. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { label: "Produkt Name", key: "productName", type: "text" },
          { label: "Produkt Modell", key: "model", type: "text" },
          { label: "Hersteller", key: "manufacturer", type: "text" },
          { label: "Stückzahl", key: "stock", type: "number" },
        ].map(({ label, key, type }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              type={type}
              value={product[key as keyof Product] as string | number}
              onChange={(e) => handleChange(key as keyof Product, e.target.value)}
            />
            {validationErrors[key as keyof Product] && (
              <p className="text-red-500 text-sm">{validationErrors[key as keyof Product]}</p>
            )}
          </div>
        ))}
        <div className="space-y-2">
          <Label htmlFor="description">Beschreibung</Label>
          <Textarea
            id="description"
            value={product.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {validationErrors.description && (
            <p className="text-red-500 text-sm">{validationErrors.description}</p>
          )}
        </div>
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
              {productCategories.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
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
              {productConditions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="images">Bilder hochladen</Label>
          <Input id="images" type="file" multiple onChange={handleFileChange} />
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
        Produkt hinzufügen
      </Button>
    </form>
  );
}
