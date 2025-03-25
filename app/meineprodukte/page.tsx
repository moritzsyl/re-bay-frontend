"use client"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import  MyProductsGrid  from "@/components/MyProductsTable"

export default function EditProductPage() {
  const { data: session } = useSession()

  if (session?.user.role !== "ROLE_ANBIETER") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Meine Produkte</h1>
      <MyProductsGrid />
    </div>
  )
}