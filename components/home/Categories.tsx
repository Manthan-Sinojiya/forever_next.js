"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Leaf, ArrowRight, Pill, ShoppingBag, Briefcase } from "lucide-react";

// Colors map for dynamic styling based on index
const styleMap = [
  { color: "from-emerald-500 to-green-400", bgLight: "bg-[#EAF6F0] text-[#10B981]", textColor: "text-[#10B981]", headerBg: "bg-[#EAF6F0]" },
  { color: "from-blue-500 to-cyan-400", bgLight: "bg-[#EBF3FC] text-[#2563EB]", textColor: "text-[#2563EB]", headerBg: "bg-[#EBF4FC]" },
  { color: "from-emerald-500 to-teal-400", bgLight: "bg-[#EAF7F2] text-[#059669]", textColor: "text-[#059669]", headerBg: "bg-[#EAF7F2]" },
  { color: "from-purple-500 to-violet-400", bgLight: "bg-[#F4EDFB] text-[#7C3AED]", textColor: "text-[#7C3AED]", headerBg: "bg-[#F4EDFB]" },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const getCategoryBadgeIcon = (title: string, textColor: string) => {
  const iconClass = `w-3.5 h-3.5 ${textColor}`;
  switch (title) {
    case "Food Supplements":
      return <Pill className={iconClass} />;
    case "Healthcare Equipments":
      return <Briefcase className={iconClass} />;
    case "Men Health":
      return <Pill className={iconClass} />;
    case "Personal Care":
      return <ShoppingBag className={iconClass} />;
    default:
      return <ShoppingBag className={iconClass} />;
  }
};

export default function Categories({ title, limit, subtitle, description }: { title?: string, limit?: number, subtitle?: string, description?: string }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Typewriter loop states
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const defaultFullText = "Recharge. Refresh. Restart.";
  const fullText = title || defaultFullText;
  
  const words = fullText.split(' ');
  const word1 = words[0] ? words[0] + (words.length > 1 ? ' ' : '') : "";
  const word2 = words[1] ? words[1] + (words.length > 2 ? ' ' : '') : "";
  const word3 = words.slice(2).join(' ');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const typeSpeed = isDeleting ? 35 : 120;
    
    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          timer = setTimeout(() => setIsDeleting(true), 4000);
          return;
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          timer = setTimeout(() => {}, 600);
          return;
        }
      }
    };

    timer = setTimeout(handleTyping, typeSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, fullText]);

  const showWord1 = currentText.substring(0, word1.length);
  const showWord2 = currentText.length > word1.length
    ? currentText.substring(word1.length, word1.length + word2.length)
    : "";
  const showWord3 = currentText.length > word1.length + word2.length
    ? currentText.substring(word1.length + word2.length)
    : "";

  useEffect(() => {
    async function fetchData() {
      try {
        const cachedCounts = sessionStorage.getItem("home_counts");
        let countsData = cachedCounts ? JSON.parse(cachedCounts) : null;
        
        let shouldFetchCounts = !countsData;
        let countsRes = null;
        
        if (shouldFetchCounts) {
          countsRes = await fetch("/api/products/counts").catch(() => null);
          if (countsRes) {
            const json = await countsRes.json();
            if (json.success && json.counts) {
              setCounts(json.counts);
              sessionStorage.setItem("home_counts", JSON.stringify(json.counts));
            }
          }
        } else {
          setCounts(countsData);
        }

        const cachedCats = sessionStorage.getItem("home_categories");
        let catsData = cachedCats ? JSON.parse(cachedCats) : null;
        
        let shouldFetchCats = !catsData;
        let catRes = null;

        if (shouldFetchCats) {
          catRes = await fetch("/api/categories").catch(() => null);
          if (catRes) {
            const json = await catRes.json();
            if (json.success && json.data) {
              const mapped = json.data.map((c: any, i: number) => {
                const style = styleMap[i % styleMap.length];
                return {
                  title: c.name,
                  slug: c.slug,
                  description: c.description || "Discover our amazing products.",
                  productImage: c.image || `/categories/${c.slug}.png`,
                  index: `0${i + 1}`.slice(-2),
                  ...style
                };
              });
              setCategories(mapped);
              sessionStorage.setItem("home_categories", JSON.stringify(mapped));
            }
          }
        } else {
          setCategories(catsData);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    }
    fetchData();
  }, []);



  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5EE] border border-emerald-100/50 text-[#10B981] text-xs font-black uppercase tracking-wider mb-4"
          >
            <Leaf className="w-3.5 h-3.5 fill-[#10B981]/20" />
            {subtitle || "Explore Categories"}
          </motion.div>
          
          <h2 className="text-3.5xl md:text-5xl font-black font-heading text-slate-800 leading-tight mb-4 tracking-tight min-h-[3rem] md:min-h-[3.75rem] flex items-center justify-center flex-wrap gap-x-2">
            <span className="inline-block text-slate-800">
              {showWord1}
            </span>
            <span className="inline-block text-[#1E5AA8]">
              {showWord2}
            </span>
            <span className="inline-block text-[#10B981] font-black">
              {showWord3}
            </span>
            <span className="animate-pulse text-emerald-500 font-extralight ml-1 select-none">|</span>
          </h2>

          {/* Separator */}
          <div className="flex items-center justify-center gap-4 my-5">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-slate-200" />
            <Leaf className="w-4 h-4 text-emerald-600 fill-emerald-500/10 rotate-[20deg]" />
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-slate-200" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed"
          >
            {description || "Browse our curated categories to find exactly what your body needs."}
          </motion.p>
        </div>

        {/* Category Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.slice(0, limit || categories.length).map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Link
                href={`/categories/${category.slug || category.title.toLowerCase().replace(/ /g, "-")}`}
                className="group block h-full cursor-pointer"
              >
                <div className="relative h-full bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-500 ease-out hover:shadow-md group-hover:-translate-y-2 overflow-hidden flex flex-col justify-between">
                  
                  {/* Top Half: Image Container */}
                  <div className={`relative w-full h-56 ${category.headerBg} flex items-center justify-center overflow-hidden`}>
                    
                    {/* Index Badge */}
                    <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center z-20">
                      <span className={`text-xs font-bold ${category.textColor}`}>
                        {category.index}
                      </span>
                    </div>

                    {/* Images container */}
                    <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500 z-10">
                      <Image
                        src={category.productImage}
                        alt={category.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-all duration-700 ease-in-out"
                        priority
                      />
                    </div>
                  </div>

                  {/* Bottom Half: Details Container */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-extrabold font-heading text-slate-800 mb-2 group-hover:text-primary transition-colors duration-300">
                        {category.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6">
                        {category.description}
                      </p>
                    </div>

                    {/* Footer area inside card */}
                    <div className="flex items-center justify-between">
                      {/* Count badge */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold ${category.bgLight} tracking-wider uppercase`}>
                        {getCategoryBadgeIcon(category.title, category.textColor)}
                        <span>
                          {counts[category.title] !== undefined
                            ? `${counts[category.title]} PRODUCT${counts[category.title] === 1 ? "" : "S"}`
                            : category.count}
                        </span>
                      </div>

                      {/* Arrow circle */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-slate-100 shadow-sm group-hover:bg-slate-50 transition-colors duration-300">
                        <ArrowRight className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
