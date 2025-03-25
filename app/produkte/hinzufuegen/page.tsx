"use client"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import AddProductForm from "@/components/AddProductForm"

export default function EditProductPage() {
  const { data: session } = useSession()

  if (session?.user.role !== "ROLE_ANBIETER") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <AddProductForm />
    </div>
  )
}