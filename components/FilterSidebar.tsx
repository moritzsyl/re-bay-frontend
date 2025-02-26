import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Product, ProductCategory, ProductCondition } from "@/lib/types";

interface SidebarProps {
  setFilteredProducts: (products: Product[]) => void;
  products: Product[];
}

export default function Sidebar({
  setFilteredProducts,
  products,
}: SidebarProps) {
  const [stock, setStock] = useState<number | string>(""); // Initial auf leeren Wert setzen
  const [condition, setCondition] = useState<ProductCondition | string>("alle");
  const [category, setCategory] = useState<ProductCategory | string>("alle");
  const [manufacturer, setManufacturer] = useState<string>("");

  const handleFilter = () => {
    const filtered = products.filter((product) => {
      return (
        (stock ? product.stock >= Number(stock) : true) && // stock als string behandeln und in eine Zahl umwandeln
        (condition !== "alle" ? product.condition === condition : true) &&
        (category !== "alle" ? product.category === category : true) &&
        (manufacturer
          ? product.manufacturer
              .toLowerCase()
              .includes(manufacturer.toLowerCase())
          : true)
      );
    });
    setFilteredProducts(filtered);
  };

  const handleReset = () => {
    setStock(""); // stock auf leeren Wert zurücksetzen
    setCondition("alle");
    setCategory("alle");
    setManufacturer("");
    setFilteredProducts(products); // Zurücksetzen der gefilterten Produkte auf den Ursprung
  };

  return (
    <div className="w-64 p-4 border-r">
      <h2 className="text-lg font-semibold mb-4 text-green-400">Filter</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="stock">Stückanzahl</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)} // stock als string behandeln
            className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400 mb-6"
          />
        </div>

        <div>
          <Label htmlFor="condition">Zustand</Label>
          <Select
            value={condition}
            onValueChange={(value) => setCondition(value)}
          >
            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400 mb-6">
              <SelectValue placeholder="Wählen Sie einen Zustand" />
            </SelectTrigger>
            <SelectGroup>
              <SelectContent>
                <SelectLabel className="text-green-400">Zustand</SelectLabel>
                <SelectItem value="alle">Alle</SelectItem>
                <SelectItem value="Neu">Neu</SelectItem>
                <SelectItem value="Kaum Benutzt">Kaum Benutzt</SelectItem>
                <SelectItem value="Benutzt">Benutzt</SelectItem>
              </SelectContent>
            </SelectGroup>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Kategorie</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400 mb-6">
              <SelectValue placeholder="Wählen Sie eine Kategorie" />
            </SelectTrigger>
            <SelectGroup>
              <SelectContent>
                <SelectLabel className="text-green-400">Kategorien</SelectLabel>
                <SelectItem value="alle">Alle</SelectItem>
                <SelectItem value="Monitor">Monitor</SelectItem>
                <SelectItem value="Computer">Computer</SelectItem>
                <SelectItem value="Computerzusatz">Computerzusatz</SelectItem>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Drucker">Drucker</SelectItem>
              </SelectContent>
            </SelectGroup>
          </Select>
        </div>

        <div>
          <Label htmlFor="manufacturer">Hersteller</Label>
          <Input
            id="manufacturer"
            placeholder="Herstellername..."
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-400 mb-6"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleFilter}
            type="button"
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Anwenden
          </Button>
          <Button
            onClick={handleReset}
            type="button"
            className="w-full bg-gray-500 hover:bg-gray-600 text-white"
          >
            Zurücksetzen
          </Button>
        </div>
      </div>
    </div>
  );
}
