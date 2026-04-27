import React from 'react';

export default function Benefits() {
  const benefits = [
    { title: "Muscle Recovery", desc: "Reduce inflammation and soreness", icon: "💪" },
    { title: "Immune Boost", desc: "Strengthen your natural defenses", icon: "🛡️" },
    { title: "Mental Clarity", desc: "Improve focus and reduce stress", icon: "🧠" },
    { title: "Better Sleep", desc: "Regulate your circadian rhythm", icon: "😴" }
  ];

  return (
    <section className="mb-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Unlock the Power of Cold</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">Experience the scientifically proven benefits of cold water immersion and thermal therapy.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {benefits.map((benefit, i) => (
          <div key={i} className="text-center p-6 rounded-3xl bg-white border border-black/5 hover:border-black/10 transition-all">
            <div className="text-4xl mb-4">{benefit.icon}</div>
            <h3 className="font-bold mb-2">{benefit.title}</h3>
            <p className="text-xs text-gray-500">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
