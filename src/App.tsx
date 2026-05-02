import { useState, useEffect, useRef } from 'react';

// Injecting Google Fonts and Custom Animations
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
  
  .font-serif { font-family: 'Playfair Display', serif; }
  .font-sans { font-family: 'Outfit', sans-serif; }
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  /* Elegant Glass Header */
  .glass-header {
    background: rgba(104, 134, 98, 0.90);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  /* Premium Noise Texture */
  .noise-overlay {
    position: absolute;
    inset: 0;
    z-index: 50;
    pointer-events: none;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  /* Custom Animations */
  @keyframes fadeUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes scaleIn {
    0% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes pulseSlow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .animate-fade-up {
    animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }
  
  .animate-scale-in {
    animation: scaleIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* Animation Delays for Staggered Load */
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
`;

const menuData = [
  {
    category: 'Pizza',
    id: 'pizza',
    image: '/pizza.jpg',
    items: [
      { name: 'Margherita Pizza', price: 129 },
      { name: 'Veggie Paradise Pizza', price: 169 },
      { name: 'Sweet Corn Pizza', price: 149 },
      { name: 'Onion & Capsicum Pizza', price: 149 },
      { name: 'Tomato Sizzling Pizza', price: 149 },
      { name: 'Mexican Pizza', price: 169 },
      { name: 'Spinach Pizza', price: 169 },
      { name: 'Paneer Pizza', price: 249, signature: true },
      { name: 'Freanzy Special Pizza', price: 299, signature: true },
    ],
  },
  {
    category: 'Burgers',
    id: 'burgers',
    image: '/burger.jpg',
    items: [
      { name: 'Mini Burger', price: 49 },
      { name: 'Veg Maharaja', price: 139 },
      { name: 'Aloo Tikki Burger', price: 79 },
      { name: 'Spicy Paneer Burger', price: 159 },
      { name: 'Paneer Tikka Burger', price: 159 },
      { name: 'Cheese Lava Veg Burger', price: 99, signature: true },
      { name: 'Veg Paradise Burger', price: 89 },
      { name: 'Freanzy Special Burger', price: 99, signature: true },
    ],
  },
  {
    category: 'Garlic Bread',
    id: 'garlic-bread',
    image: '/garlic-bread.jpg',
    items: [
      { name: 'Cheese Garlic Bread', price: 99 },
      { name: 'Cheese Corn Bread', price: 109 },
      { name: 'Veg. Garlic Bread', price: 109 },
      { name: 'Onion Chilly Garlic Bread', price: 119, signature: true },
    ],
  },
  {
    category: 'Pasta',
    id: 'pasta',
    image: '/pasta.jpg',
    items: [
      { name: 'Alfredo Pasta', price: 149 },
      { name: 'Arrabbiata Pasta', price: 129 },
      { name: 'Pesto Pasta', price: 249, signature: true },
      { name: 'Freanzy Special Pasta', price: 129, signature: true },
      { name: 'Mediterranean Grilled Cottage Cheese Stick', price: 149 },
    ],
  },
  {
    category: 'Frankies',
    id: 'frankies',
    image: '/franky.jpg',
    items: [
      { name: 'Cheese Potato Frankie', price: 89 },
      { name: 'Veg Paneer Frankie', price: 149 },
      { name: 'Paneer Exotica Frankie', price: 169 },
      { name: 'Veggie Cheese Frankie', price: 99 },
      { name: 'Cheese Schezwan Frankie', price: 129 },
      { name: 'Mexican Cheese Frankie', price: 149 },
      { name: 'Noodles Frankie', price: 129 },
    ],
  },
  {
    category: 'Sandwich',
    id: 'sandwich',
    image: '/sandwich.jpg',
    items: [
      { name: 'Veg Sandwich', price: 79 },
      { name: 'Veg Grilled Sandwich', price: 99 },
      { name: 'Bombay Masala Sandwich', price: 159 },
      { name: 'Paneer Tikka Sandwich', price: 149 },
      { name: 'Cheese Corn Sandwich', price: 149 },
      { name: 'Vegetable Club Sandwich', price: 179 },
      { name: 'Paneer Cheese Sandwich', price: 169 },
      { name: 'Freanzy Special Sandwich', price: 199, signature: true },
    ],
  },
  {
    category: 'French Fries',
    id: 'french-fries',
    image: '/french-fries.jpg',
    items: [
      { name: 'Regular French Fries', price: 79 },
      { name: 'Peri Peri Fries', price: 89 },
      { name: 'Loaded Cheese Fries', price: 99 },
      { name: 'Truffle Parmesan Fries', price: 159, signature: true },
    ],
  },
  {
    category: 'Small Bites',
    id: 'small-bites',
    image: '/small-bites.jpg',
    items: [
      { name: 'Mozzarella Stick', price: 199 },
      { name: 'Cheese Balls', price: 149 },
      { name: 'Cheese Corn Balls', price: 149 },
      { name: 'Baked Cheese Nachos', price: 169 },
      { name: 'Tacos', price: 149 },
      { name: 'Onion Rings', price: 149 },
      { name: 'Pocket Pizza', price: 149 },
    ],
  },
  {
    category: 'Momo',
    id: 'momo',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    items: [
      { name: 'Veg Momo', price: 99 },
      { name: 'Veg Momo Fry', price: 119 },
      { name: 'Paneer Momo', price: 149 },
      { name: 'Paneer Momo Fry', price: 169 },
    ],
  },
  {
    category: 'Chinese Dishes',
    id: 'chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    items: [
      { name: 'Paneer with Bell Peppers', price: 179 },
      { name: 'Honey Chilly Lotus Stem', price: 199, signature: true },
      { name: 'Dragon Potato', price: 149 },
      { name: 'Chowmine', price: 99 },
      { name: 'Hakka Noodles', price: 89 },
      { name: 'Kung Pao Noodles', price: 119 },
      { name: 'Burnt Garlic Noodles', price: 129 },
      { name: 'Manchuriyan Dry/Gravy', price: 149 },
      { name: 'Wok Tossed Cottage Cheese', price: 229, signature: true },
    ],
  },
];

const combos = [
  {
    title: 'The Italian Pour',
    items: 'Any Signature Pasta paired with a Glass of House Wine',
    price: 199,
    image: '/pasta-wine.jpg',
  },
  {
    title: 'Street Side Classic',
    items: 'Our famous Potato Frankie with a refreshing Soft Drink',
    price: 69,
    image: '/franky-drink.jpg',
  },
  {
    title: 'The Grand Craving',
    items: 'Gourmet Grilled Sandwich, Truffle Fries & Soft Drink',
    price: 99,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
  },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('hero');
  const navRef = useRef<any>(null); // Added <any> for TS

  // Added ': any' to id to fix TypeScript error
  const scrollToCategory = (id: any) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory(id);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id !== 'hero') {
            setActiveCategory(entry.target.id);
            const navItem = document.getElementById(`nav-${entry.target.id}`);
            if (navItem && navRef.current) {
              // @ts-ignore (silences strict TS errors for inline behavior options)
              navItem.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
              });
            }
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    menuData.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#111] flex justify-center w-full selection:bg-[#F3E0B9] selection:text-[#688662]">
      <style dangerouslySetInnerHTML={{ __html: fontStyles }} />

      {/* Mobile Device Constraint */}
      <div className="w-full max-w-[450px] bg-[#688662] text-[#FDFBF7] relative shadow-2xl overflow-x-hidden flex flex-col h-screen">
        {/* Subtle Noise Texture Overlay */}
        <div className="noise-overlay"></div>

        {/* Elegant Glassmorphic Header */}
        <header className="sticky top-0 z-40 glass-header pt-8 pb-0 px-0 shadow-sm animate-fade-up border-b border-[#F3E0B9]/10">
          <div
            className="text-center mb-5 px-4 cursor-pointer flex flex-col items-center justify-center"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* Image Logo Placeholder */}
            <img
              src="/freanzy.png"
              alt="Freanzy Logo"
              className="h-10 w-auto object-contain drop-shadow-md mb-1"
            />

            {/* If your logo image already includes the "Love at every bite" tagline, you can delete this <p> tag */}
            <p className="font-sans text-[9px] font-medium text-[#FDFBF7]/80 uppercase tracking-[0.35em] mt-1 opacity-80">
              Love at every bite
            </p>
          </div>

          {/* Minimalist Tab Navigation */}
          <nav
            ref={navRef}
            className="flex overflow-x-auto gap-6 px-6 pb-4 scrollbar-hide snap-x"
          >
            {menuData.map((cat) => (
              <button
                key={cat.id}
                id={`nav-${cat.id}`}
                onClick={() => scrollToCategory(cat.id)}
                className={`whitespace-nowrap pb-2 text-[11px] uppercase tracking-widest font-sans font-medium transition-all duration-300 snap-center relative ${
                  activeCategory === cat.id
                    ? 'text-[#F3E0B9]'
                    : 'text-[#FDFBF7]/50 hover:text-[#FDFBF7]/90'
                }`}
              >
                {cat.category}
                {/* Animated Indicator Line */}
                {activeCategory === cat.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#F3E0B9] transform origin-center transition-all duration-500 ease-out shadow-[0_0_8px_rgba(243,224,185,0.4)]"></span>
                )}
              </button>
            ))}
          </nav>
        </header>

        {/* Main Scrolling Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth relative z-10 scrollbar-hide">
          {/* Hero Section */}
          <div
            id="hero"
            className="w-full h-[60vh] relative flex flex-col justify-end p-8 mb-4"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src="/freanzy-land.png"
                alt="Freanzy Ambience"
                className="w-full h-full object-cover opacity-60 animate-scale-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#688662] via-[#688662]/60 to-transparent"></div>
            </div>
            <div className="relative z-10 animate-fade-up delay-200">
              <div className="inline-block px-3 py-1 border border-[#F3E0B9]/30 rounded-full mb-4 backdrop-blur-sm">
                <span className="font-sans text-[10px] tracking-widest uppercase text-[#F3E0B9]">
                  Explore Our Website
                </span>
              </div>
              <h2 className="font-serif text-5xl text-[#FDFBF7] leading-tight mb-4 drop-shadow-md">
                Taste the <br />
                <span className="italic text-[#F3E0B9]">Extraordinary</span>
              </h2>
              <p className="font-sans font-light text-sm text-[#FDFBF7]/90 leading-relaxed max-w-[80%]">
                Authentic continental cuisine, handcrafted pizzas, and unique
                sober infusions.
              </p>
            </div>
          </div>

          {/* Menu Sections */}
          <div className="px-6 space-y-16">
            {/* Removed the unused catIdx mapping parameter here */}
            {menuData.map((category) => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-32"
              >
                {/* Category Header */}
                <div
                  className="flex flex-col items-center justify-center gap-2 mb-10 animate-fade-up"
                  style={{ animationDelay: '0.1s' }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#F3E0B9]/50 mb-1"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                  <h2 className="text-3xl font-serif text-[#F3E0B9] italic tracking-wide text-center">
                    {category.category}
                  </h2>
                </div>

                {/* Optional Category Image */}
                {category.image && (
                  <div className="w-full h-56 mb-10 rounded-xl overflow-hidden relative shadow-2xl animate-fade-up">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#688662] via-transparent to-transparent z-10 opacity-80"></div>
                    <img
                      src={category.image}
                      alt={category.category}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[2000ms] ease-out"
                    />
                  </div>
                )}

                {/* Refined Item List */}
                <div className="space-y-6">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-end justify-between group cursor-pointer animate-fade-up"
                      style={{ animationDelay: `${(index % 5) * 0.1}s` }}
                    >
                      <div className="pr-3 bg-[#688662] relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300">
                        <h3 className="font-serif text-[17px] font-medium text-[#FDFBF7] leading-tight group-hover:text-[#F3E0B9] transition-colors">
                          {item.name}
                        </h3>
                        {item.signature && (
                          <span className="inline-flex items-center gap-1 mt-1 font-sans text-[9px] uppercase tracking-widest text-[#F3E0B9]/90 font-medium">
                            <svg
                              className="w-2.5 h-2.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            Signature
                          </span>
                        )}
                      </div>

                      {/* Elegant Dotted Leader */}
                      <div className="flex-grow border-b-2 border-dotted border-[#F3E0B9]/20 mx-2 mb-[6px] relative z-0 group-hover:border-[#F3E0B9]/40 transition-colors"></div>

                      <div className="flex-shrink-0 bg-[#688662] pl-2 relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300">
                        <span className="font-sans font-medium tracking-wider text-[16px] text-[#F3E0B9]">
                          ₹{item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Curated Experiences (Combos) */}
          <div className="bg-[#5A7454] px-6 py-16 mt-16 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)] relative z-10 border-t border-[#F3E0B9]/10">
            <div className="text-center mb-12 animate-fade-up">
              <p className="font-sans text-[10px] font-semibold text-[#F3E0B9] uppercase tracking-[0.4em] mb-3">
                Curated for you
              </p>
              <h2 className="text-4xl font-serif text-[#FDFBF7] italic">
                Experiences
              </h2>
            </div>

            <div className="space-y-8">
              {combos.map((combo, idx) => (
                <div
                  key={idx}
                  className="bg-[#688662] rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 animate-fade-up border border-[#F3E0B9]/10"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <div className="p-8 text-center relative bg-[#688662]">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#5A7454] rounded-full border-4 border-[#688662] flex items-center justify-center z-20 text-[#F3E0B9]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="font-serif text-2xl text-[#F3E0B9] mb-3 mt-2">
                      {combo.title}
                    </h3>
                    <p className="font-sans font-light text-[14px] text-[#FDFBF7]/80 leading-relaxed mb-6 px-4">
                      {combo.items}
                    </p>
                    <div className="inline-flex items-center justify-center border border-[#F3E0B9]/40 rounded-full px-6 py-2 font-sans font-medium tracking-widest text-[#F3E0B9] group-hover:bg-[#F3E0B9] group-hover:text-[#5A7454] transition-colors duration-300">
                      ₹{combo.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Footer */}
          <footer className="px-8 py-24 text-center bg-[#465A42] relative border-t border-[#F3E0B9]/10">
            {/* Elegant Icon */}
            <div className="text-[#F3E0B9] mb-10 flex justify-center opacity-80">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>

            <h3 className="text-xs font-sans font-semibold tracking-[0.3em] text-[#F3E0B9] uppercase mb-8">
              Our Story
            </h3>
            <p className="font-serif text-xl italic text-[#FDFBF7] mb-8 leading-loose">
              "From Dubai, With Love."
            </p>
            <div className="max-w-[90%] mx-auto space-y-6">
              <p className="font-sans font-light text-[14px] text-[#FDFBF7]/70 leading-relaxed text-center">
                It started with three friends, a shared kitchen in Dubai, and a
                dream that followed us across borders. After years of perfecting
                the art of the crust and the secret to the richest sauces in the
                heart of the Mediterranean, we brought those flavors home.
              </p>
              <p className="font-sans font-light text-[14px] text-[#FDFBF7]/70 leading-relaxed text-center mb-12">
                We specialize in Authentic Continental Cuisine. Our journey
                taught us that great food doesn't need a wine list to
                shine—which is why we've curated a Unique Sober Bar, serving
                sophisticated, non-alcoholic infusions.
              </p>
            </div>

            <div className="mt-16 pt-12 border-t border-[#F3E0B9]/10">
              <p className="font-serif text-3xl text-[#F3E0B9] italic drop-shadow-md">
                Buon Appetito!
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}