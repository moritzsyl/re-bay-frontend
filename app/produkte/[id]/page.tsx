"use client"
import type { Product } from "@/lib/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function ProductDetails({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  
    if (!session) {
      redirect("/produkte")
    }
  
  return (
    <p>{session?.user.id +"----"+ session?.user.role}</p>
  )
}

