"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2, ImagePlus, X } from "lucide-react";
import {
  Product,
  ProductCategory,
  ProductCondition,
  ProductCategories,
  ProductConditions,
  conditionDisplayNames,
  categoryDisplayNames,
} from "@/lib/types";

export default function EditProduct() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof Product, string>>>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8050/products/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });
        if (!response.ok) throw new Error("Fehler beim Laden des Produkts.");
        const data: Product = await response.json();
        setProduct(data);
        setPreviewImages(data.images || []);
      } catch (err) {
        console.error(err);
        setError("Produkt konnte nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      fetchProduct();
    }
  }, [id, session?.token]);

  const validateField = (key: keyof Product, value: any): boolean => {
    let errorMessage = "";

    if (["productName", "model", "manufacturer", "description"].includes(key)) {
      if (!value || value.trim() === "") errorMessage = `${key} ist erforderlich`;
    } else if (key === "stock") {
      if (value === "" || isNaN(Number(value)) || Number(value) < 0) errorMessage = "Stückzahl muss eine positive Zahl sein";
    } else if (key === "category" && !value) {
      errorMessage = "Kategorie ist erforderlich";
    } else if (key === "condition" && !value) {
      errorMessage = "Zustand ist erforderlich";
    } else if (key === "images" && previewImages.length === 0) {
      errorMessage = "Mindestens ein Bild ist erforderlich";
    }

    setValidationErrors((prev) => ({ ...prev, [key]: errorMessage }));
    return errorMessage === "";
  };

  const validateForm = (): boolean => {
    if (!product) return false;
    return (Object.keys(product) as (keyof Product)[]).every((key) => validateField(key, product[key]));
  };

  const handleChange = (key: keyof Product, value: any) => {
    if (!product) return;
    const updated = { ...product, [key]: value };
    setProduct(updated);
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
    setNewImages(prev => [...prev, ...files]);
    
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
      
      setProduct(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          images: [...prev.images, ...base64Images]
        };
      });
      
      if (product) {
        validateField("images", [...product.images, ...base64Images]);
      }
    } catch (err) {
      console.error("Fehler beim Konvertieren der Bilder:", err);
      setError("Fehler beim Verarbeiten der Bilder. Bitte versuchen Sie es erneut.");
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setProduct(prev => {
      if (!prev) return null;
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!session?.token) {
      setError("Sie müssen angemeldet sein.");
      return;
    }

    if (!product) return;

    const isValid = validateForm();
    if (!isValid) {
      setError("Bitte korrigieren Sie die Fehler im Formular.");
      return;
    }

    setIsSubmitting(true);
    console.log(JSON.stringify(product))
    try {
      const response = await fetch(`http://localhost:8050/products/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Unbekannter Fehler");
      }

      setSuccess("Produkt erfolgreich aktualisiert.");
      setTimeout(() => {
        router.push('/meineprodukte');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p className="text-center">Lade Produktdaten...</p>;

  if (!product) return <p className="text-center text-red-500">Produkt nicht gefunden.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Produkt bearbeiten</h1>

      {success && <Alert className="mb-4 bg-green-50 border-green-200"><AlertDescription className="text-green-700">{success}</AlertDescription></Alert>}
      {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="productName">Produkt Name *</Label>
            <Input
              id="productName"
              value={product.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              className={validationErrors.productName ? "border-red-500" : ""}
            />
            {validationErrors.productName && <p className="text-red-500 text-sm">{validationErrors.productName}</p>}
          </div>

          <div>
            <Label htmlFor="model">Modell *</Label>
            <Input
              id="model"
              value={product.model}
              onChange={(e) => handleChange("model", e.target.value)}
              className={validationErrors.model ? "border-red-500" : ""}
            />
            {validationErrors.model && <p className="text-red-500 text-sm">{validationErrors.model}</p>}
          </div>

          <div>
            <Label htmlFor="manufacturer">Hersteller *</Label>
            <Input
              id="manufacturer"
              value={product.manufacturer}
              onChange={(e) => handleChange("manufacturer", e.target.value)}
              className={validationErrors.manufacturer ? "border-red-500" : ""}
            />
            {validationErrors.manufacturer && <p className="text-red-500 text-sm">{validationErrors.manufacturer}</p>}
          </div>

          <div>
            <Label htmlFor="stock">Stückzahl *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={product.stock}
              onChange={(e) => handleChange("stock", Number(e.target.value))}
              className={validationErrors.stock ? "border-red-500" : ""}
            />
            {validationErrors.stock && <p className="text-red-500 text-sm">{validationErrors.stock}</p>}
          </div>

          <div>
            <Label htmlFor="category">Kategorie *</Label>
            <Select value={product.category} onValueChange={(val) => handleChange("category", val as ProductCategory)}>
              <SelectTrigger id="category" className={`w-full ${validationErrors.category ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                {ProductCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryDisplayNames[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.category && <p className="text-red-500 text-sm">{validationErrors.category}</p>}
          </div>

          <div>
            <Label htmlFor="condition">Zustand *</Label>
            <Select value={product.condition} onValueChange={(val) => handleChange("condition", val as ProductCondition)}>
              <SelectTrigger id="condition" className={`w-full ${validationErrors.condition ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Zustand wählen" />
              </SelectTrigger>
              <SelectContent>
                {ProductConditions.map((cond) => (
                  <SelectItem key={cond} value={cond}>
                    {conditionDisplayNames[cond]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.condition && <p className="text-red-500 text-sm">{validationErrors.condition}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Beschreibung *</Label>
          <Textarea
            id="description"
            rows={4}
            value={product.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={validationErrors.description ? "border-red-500" : ""}
          />
          {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="images">Bilder *</Label>
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
                    src={src.startsWith('data:image') ? src : `data:image/jpeg;base64,${src}`}
                    alt={`Bild ${index + 1}`}
                    className="h-32 w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="bg-green-500 text-white hover:bg-green-600" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aktualisieren...
              </>
            ) : (
              "Produkt aktualisieren"
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/meineprodukte')}
          >
            Abbrechen
          </Button>
        </div>
      </form>
    </div>
  );
}
