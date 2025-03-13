
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <section className="container mx-auto px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-custom-green leading-tight">
              Willkommen bei <span className="text-green-600">re-bay</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700">
              Ihr Marktplatz für nachhaltige Produkte. Entdecken Sie umweltfreundliche Alternativen und unterstützen Sie nachhaltigen Konsum.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-md h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/placeholder.svg?height=500&width=500"
                alt="Nachhaltige Produkte"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
