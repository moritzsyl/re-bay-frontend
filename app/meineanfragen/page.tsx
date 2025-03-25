import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { MyRequestsTable } from "@/components/MyRequestsTable"

export default async function EditProductPage() {
  const { data: session } = useSession()

  if (session?.user.role !== "ROLE_ABNEHMER") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Meine Anfragen</h1>
      <MyRequestsTable />
    </div>
  )
}