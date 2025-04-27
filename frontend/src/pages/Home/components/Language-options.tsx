export default function LanguageOptions() {
  const languages = [
    { name: "KOREAN" },
    { name: "JAPANESE" },
    { name: "IELTS" },
  ];

  return (
    <section className="py-8 sm:py-12 w-full">
      <div className="container mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {languages.map((language, index) => (
            <div
              key={index}
              className="bg-custom-blue1 text-white h-16 sm:h-24 flex items-center justify-center text-xl sm:text-2xl font-bold hover:bg-slate-600 transition cursor-pointer ubuntu text-box"
            >
              {language.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
