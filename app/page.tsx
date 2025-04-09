export default function HomePage() {
  return (
    <div id="MainPage" className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <section className="container mx-auto px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="flex justify-center">
          <div className="flex flex-col gap-6 text-center max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-custom-green leading-tight">
              Willkommen bei <span className="text-green-600">re-bay</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700">
            Ihr Marktplatz für wiederverwendbare Elektronik. Entdecken Sie nachhaltige Alternativen und fördern Sie bewussten Konsum.
            </p>
          </div>
        </div>
      </section>
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Warum re-bay?</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Re-bay ist mehr als nur ein Marktplatz. Es ist eine Bewegung hin zu einem nachhaltigeren Lebensstil. 
          Wir fördern den Austausch von elektronischen Produkten, um gemeinsam eine bessere Zukunft zu gestalten.
        </p>
      </div>
    </div>
  );
}