import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { EditProductForm } from "@/components/EditProductForm"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Produkt Bearbeiten</h1>
      <EditProductForm productId={params.id} />
    </div>
  )
}

