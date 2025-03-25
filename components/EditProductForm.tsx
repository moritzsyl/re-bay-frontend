import { useSession } from "next-auth/react";
export default function EditProductForm() {
  const { data: session } = useSession();
  return(
    <div>
      <h1>Edit Product Form Component</h1>
    </div>
  )
}
