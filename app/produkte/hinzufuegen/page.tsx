import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import AddProductForm from "@/components/AddProductForm"

export default async function EditProductPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Produkt Hinzufügen</h1>
      <AddProductForm />
    </div>
  )
}