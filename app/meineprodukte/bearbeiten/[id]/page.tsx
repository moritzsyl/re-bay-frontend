"use client"
import { redirect } from "next/navigation"
import EditProductForm from "@/components/EditProductForm"
import { useSession } from "next-auth/react"

export default function EditProductPage() {
  const { data: session } = useSession()

  if (session?.user.role !== "ROLE_ANBIETER") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <EditProductForm />
    </div>
  )
}

