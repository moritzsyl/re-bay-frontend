"use client"
import { redirect } from "next/navigation"
import EditProductForm from "@/components/EditProductForm"
import { useSession } from "next-auth/react"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()

  if (session?.user.role !== "ROLE_ANBIETER") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Produkt Bearbeiten</h1>
      <EditProductForm />
    </div>
  )
}

