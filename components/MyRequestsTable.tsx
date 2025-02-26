"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Request {
    id: string;
    productName: string;
    productModel: string;
    productManufacturer: string;
    productCategory: string;
    productCondition: string;
}

export function MyRequestsTable() {
  const [requests, setRequests] = useState<Request[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchRequests();
    }
  }, [session]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:8050/requests/mine", {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Fehler beim Laden der Anfragen. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8050/requests/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete request");
      }
      setRequests(requests.filter((request) => request.id !== id));
      toast({
        title: "Erfolg",
        description: "Anfrage erfolgreich gelöscht.",
      });
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "Error",
        description: "Fehler beim Löschen der Anfrage. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produktname</TableHead>
          <TableHead>Modell</TableHead>
          <TableHead>Hersteller</TableHead>
          <TableHead>Kategorie</TableHead>
          <TableHead>Zustand</TableHead>
          <TableHead className="text-right">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.productName}</TableCell>
            <TableCell>{request.productModel}</TableCell>
            <TableCell>{request.productManufacturer}</TableCell>
            <TableCell>{request.productCategory}</TableCell>
            <TableCell>{request.productCondition}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDelete(request.id)}>
                <span className="sr-only">Löschen</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
