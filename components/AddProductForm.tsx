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
import { 
  Product, 
  ProductCategory, 
  ProductCondition, 
  ProductCategories, 
  ProductConditions,
  conditionDisplayNames,
  categoryDisplayNames
} from "@/lib/types";
import { ImagePlus, Loader2 } from 'lucide-react';
import { json } from "stream/consumers";
import { redirect } from "next/dist/server/api-utils";

export default function AddProduct() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [product, setProduct] = useState<Omit<Product, "id">>({
    productName: "",
    model: "",
    manufacturer: "",
    stock: 0,
    description: "",
    category: ProductCategories[0],
    condition: ProductConditions[0],
    images: [],
  });
  
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof Omit<Product, "id">, string>>>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const validateField = (key: keyof Omit<Product, "id">, value: any): boolean => {
    let errorMessage = "";
    
    if (key === "productName" || key === "model" || key === "manufacturer" || key === "description") {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errorMessage = `${key} ist erforderlich`;
      }
    } else if (key === "stock") {
      if (value === undefined || value === null || value === "") {
        errorMessage = "Stückzahl ist erforderlich";
      } else if (isNaN(Number(value)) || Number(value) < 0) {
        errorMessage = "Stückzahl muss eine positive Zahl sein";
      }
    } else if (key === "category" && (!value || value === "")) {
      errorMessage = "Kategorie ist erforderlich";
    } else if (key === "condition" && (!value || value === "")) {
      errorMessage = "Zustand ist erforderlich";
    } else if (key === "images" && (!value || !Array.isArray(value) || value.length === 0)) {
      errorMessage = "Mindestens ein Bild ist erforderlich";
    }
    
    setValidationErrors(prev => ({ ...prev, [key]: errorMessage }));
    return errorMessage === "";
  };

  const validateForm = (): boolean => {
    const fields = Object.keys(product) as Array<keyof Omit<Product, "id">>;
    const validationResults = fields.map(field => validateField(field, product[field]));
    return validationResults.every(isValid => isValid);
  };

  const handleChange = (key: keyof Omit<Product, "id">, value: any) => {
    setProduct(prev => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    // Validate file types
    const validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validFileTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError("Nur Bilddateien (JPEG, PNG, GIF, WEBP) sind erlaubt");
      return;
    }
    
    // Create preview URLs for UI display
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...previews]);
    
    // Convert to base64 for API submission
    try {
      const base64Images = await Promise.all(
        files.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, ...base64Images]
      }));
      
      validateField("images", [...product.images, ...base64Images]);
    } catch (err) {
      console.error("Fehler beim Konvertieren der Bilder:", err);
      setError("Fehler beim Verarbeiten der Bilder. Bitte versuchen Sie es erneut.");
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!session?.token) {
      setError("Sie müssen angemeldet sein, um ein Produkt hinzuzufügen.");
      return;
    }
    
    const isValid = validateForm();
    if (!isValid) {
      setError("Bitte korrigieren Sie die Fehler im Formular.");
      return;
    }
    
    setIsSubmitting(true);
    console.log(JSON.stringify(product))
    try {
      const response = await fetch("http://localhost:8050/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(product),
      });
      console.log(JSON.stringify(product))
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Fehler: ${response.status}`);
      }
      
      // Reset form on success
      setProduct({
        productName: "",
        model: "",
        manufacturer: "",
        stock: 0,
        description: "",
        category: ProductCategories[0],
        condition: ProductConditions[0],
        images: [],
      });
      setPreviewImages([]);
      setValidationErrors({});
      setSuccess("Produkt wurde erfolgreich hinzugefügt!");
    } catch (err) {
      console.error("Fehler beim Hinzufügen des Produkts:", err);
      setError(err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Neues Produkt hinzufügen</h1>
      
      {success && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="productName">Produkt Name *</Label>
            <Input
              id="productName"
              value={product.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              className={validationErrors.productName ? "border-red-500" : ""}
            />
            {validationErrors.productName && (
              <p className="text-red-500 text-sm">{validationErrors.productName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Produkt Modell *</Label>
            <Input
              id="model"
              value={product.model}
              onChange={(e) => handleChange("model", e.target.value)}
              className={validationErrors.model ? "border-red-500" : ""}
            />
            {validationErrors.model && (
              <p className="text-red-500 text-sm">{validationErrors.model}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Hersteller *</Label>
            <Input
              id="manufacturer"
              value={product.manufacturer}
              onChange={(e) => handleChange("manufacturer", e.target.value)}
              className={validationErrors.manufacturer ? "border-red-500" : ""}
            />
            {validationErrors.manufacturer && (
              <p className="text-red-500 text-sm">{validationErrors.manufacturer}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Stückzahl *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              placeholder="0"
              value={product.stock}
              onChange={(e) => handleChange("stock", parseInt(e.target.value) || 0)}
              className={validationErrors.stock ? "border-red-500" : ""}
            />
            {validationErrors.stock && (
              <p className="text-red-500 text-sm">{validationErrors.stock}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Kategorie *</Label>
            <Select
              value={product.category}
              onValueChange={(value) => handleChange("category", value as ProductCategory)}
            >
              <SelectTrigger 
                id="category" 
                className={`w-full ${validationErrors.category ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                {ProductCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {categoryDisplayNames[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.category && (
              <p className="text-red-500 text-sm">{validationErrors.category}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="condition">Zustand *</Label>
            <Select
              value={product.condition}
              onValueChange={(value) => handleChange("condition", value as ProductCondition)}
            >
              <SelectTrigger 
                id="condition" 
                className={`w-full ${validationErrors.condition ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Zustand wählen" />
              </SelectTrigger>
              <SelectContent>
                {ProductConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {conditionDisplayNames[condition]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.condition && (
              <p className="text-red-500 text-sm">{validationErrors.condition}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Beschreibung *</Label>
          <Textarea
            id="description"
            rows={5}
            value={product.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={validationErrors.description ? "border-red-500" : ""}
          />
          {validationErrors.description && (
            <p className="text-red-500 text-sm">{validationErrors.description}</p>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="images">Bilder hochladen *</Label>
            <div className="flex items-center gap-2">
              <Label 
                htmlFor="images" 
                className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${
                  validationErrors.images ? "border-red-500" : "border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImagePlus className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">Klicken Sie zum Hochladen oder ziehen Sie Bilder hierher</p>
                </div>
                <Input 
                  id="images" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </Label>
            </div>
            {validationErrors.images && (
              <p className="text-red-500 text-sm">{validationErrors.images}</p>
            )}
          </div>
          
          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {previewImages.map((src, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={src || "/placeholder.svg"} 
                    alt={`Vorschau ${index + 1}`} 
                    className="h-32 w-full object-cover rounded-lg border" 
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="sr-only">Entfernen</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird hinzugefügt...
            </>
          ) : (
            "Produkt hinzufügen"
          )}
        </Button>
      </form>
    </div>
  );
}
