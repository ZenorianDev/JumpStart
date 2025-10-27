"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const interestsList = [
  { id: 1, title: "Fashion", img: "/images/fashion.jpg" },
  { id: 2, title: "Technology", img: "/images/tech.jpg" },
  { id: 3, title: "Travel", img: "/images/travel.jpg" },
  { id: 4, title: "Sports", img: "/images/sports.jpg" },
  { id: 5, title: "Food", img: "/images/food.jpg" },
  { id: 6, title: "Art", img: "/images/art.jpg" },
  { id: 7, title: "Gaming", img: "/images/gaming.jpg" },
  { id: 8, title: "Health", img: "/images/health.jpg" },
  { id: 9, title: "Photography", img: "/images/photo.jpg" },
  { id: 10, title: "Music", img: "/images/music.jpg" },
  { id: 11, title: "Business", img: "/images/business.jpg" },
  { id: 12, title: "Science", img: "/images/science.jpg" },
];

export default function InterestSelectionPage() {
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const router = useRouter();

  const toggleInterest = (id: number) => {
    setSelectedInterests((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    const selectedTitles = interestsList
      .filter((i) => selectedInterests.includes(i.id))
      .map((i) => i.title);

    localStorage.setItem("userInterests", JSON.stringify(selectedTitles));

    // Trigger AI personalization overlay
    setIsPersonalizing(true);

    // Simulate personalization process
    setTimeout(() => {
      setIsPersonalizing(false);
      router.push("/dashboard");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* === AI Personalization Overlay === */}
      <AnimatePresence>
        {isPersonalizing && (
          <motion.div
            className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              🤖 Personalizing your experience...
            </motion.h2>
            <motion.p
              className="text-gray-600 mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Analyzing your selected interests to tailor your dashboard
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "16rem" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <motion.div
                className="h-full bg-black"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="sticky top-0 bg-black text-white flex justify-between items-center px-10 py-4 z-40">
        <h1
          onClick={() => router.push("/")}
          className="font-bold text-xl cursor-pointer"
        >
          JumpStart
        </h1>
        <ul className="hidden md:flex space-x-6">
          <li className="cursor-pointer">Explore</li>
          <li className="cursor-pointer">About</li>
          <li className="cursor-pointer">Businesses</li>
          <li className="cursor-pointer">Create</li>
          <li className="cursor-pointer">Contact Us</li>
        </ul>
        <div className="space-x-3">
          <button className="border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition">
            Sign In
          </button>
          <button className="bg-white text-black px-3 py-1 rounded hover:opacity-90 transition">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Header */}
      <section className="text-center py-16">
        <h2 className="text-3xl md:text-4xl font-bold">
          Choose What Interests You
        </h2>
        <p className="text-gray-600 mt-2">We’ll personalize what you want!</p>
      </section>

      {/* Interests Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-8 md:px-16 pb-16">
        {interestsList.map((interest) => (
          <div
            key={interest.id}
            className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
              selectedInterests.includes(interest.id)
                ? "border-black shadow-lg scale-105"
                : "border-transparent hover:scale-105 hover:shadow-md"
            }`}
            onClick={() => toggleInterest(interest.id)}
          >
            <div className="w-full aspect-square relative">
              <Image
                src={interest.img}
                alt={interest.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 w-full text-center bg-black/60 text-white py-2 text-sm md:text-base">
              {interest.title}
            </div>
          </div>
        ))}
      </section>

      {/* Continue Button */}
      {selectedInterests.length > 0 && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-40">
          <button
            onClick={handleContinue}
            className="bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all"
          >
            Confirm Selection
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-10 text-center text-sm mt-auto">
        <p>© 2025 JumpStart | All Rights Reserved.</p>
      </footer>
    </div>
  );
}
