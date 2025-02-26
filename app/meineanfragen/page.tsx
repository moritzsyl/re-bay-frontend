import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { MyRequestsTable } from "@/components/MyRequestsTable"

export default async function EditProductPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Meine Anfragen</h1>
      <MyRequestsTable />
    </div>
  )
}