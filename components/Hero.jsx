
export default function Hero ({title,subtitle}) {
  return (
    <section className="bg-gradient-to-b from-cyan-400 to-cyan-200 py-10 mb-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-[#1C1C84] sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="my-4 text-2xl text-[#1C1C84]">
          {subtitle}
        </p>
      </div>
    </div>
  </section>
  )
}

