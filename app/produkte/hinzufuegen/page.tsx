import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import AddProductForm from "@/components/AddProductForm"

export default async function EditProductPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/produkte")
  }

  return (
    <div className="container mx-auto py-10">
      <AddProductForm />
    </div>
  )
}