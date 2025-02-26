"use server"

export async function requestProduct(formData: FormData) {
  const productId = formData.get("productId")

  // Hier würden Sie normalerweise die Anfrage in einer Datenbank speichern
  // oder eine E-Mail senden, etc.
  console.log(`Anfrage für Produkt ${productId} erhalten`)

  // Simulieren Sie eine Verzögerung für die Verarbeitung
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

