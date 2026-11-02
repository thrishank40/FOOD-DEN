import { Link } from "react-router-dom";

const Hero = () => (
  <section
    className="relative overflow-hidden min-h-screen flex items-center"
    style={{
      background: "linear-gradient(135deg, #0f2617 0%, #1a4731 40%, #1e5c3b 70%, #0f2617 100%)"
    }}
  >
    {/* Decorative blobs */}
    <div
      className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-10"
      style={{ background: "radial-gradient(circle, #f59e0b, transparent)", transform: "translate(30%, -30%)" }}
    />
    <div
      className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10"
      style={{ background: "radial-gradient(circle, #86efac, transparent)", transform: "translate(-30%, 30%)" }}
    />

    {/* Floating food emojis */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {["🍕", "🍔", "🍟", "🥤", "🍦"].map((emoji, i) => (
        <span
          key={i}
          className="absolute text-4xl select-none"
          style={{
            top: `${10 + i * 18}%`,
            left: `${5 + i * 18}%`,
            opacity: 0.08,
            transform: `rotate(${i * 12}deg)`,
            fontSize: "5rem",
          }}
        >
          {emoji}
        </span>
      ))}
    </div>

    <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 w-full">
      <div className="grid items-center gap-16 lg:grid-cols-2">

        {/* Left content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}>
            <span>🌟</span> Fresh meals, fast delivery across the city
          </div>

          <div>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
              Food That
              <span className="block" style={{ color: "#f59e0b" }}>Makes Your</span>
              Day Better
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-green-100/80">
              Explore mouthwatering dishes from premium pizzas, loaded burgers, crispy fries and refreshing beverages.
              Delivered hot to your doorstep.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-gray-900 shadow-2xl transition hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}
            >
              🍽️ Explore Menu
            </Link>
            <Link
              to="/offers"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              🔥 View Offers
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { value: "200+", label: "Menu Items" },
              { value: "4.9★", label: "Avg Rating" },
              { value: "30min", label: "Delivery" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs font-medium mt-1" style={{ color: "#86efac" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div className="relative flex items-center justify-center">
          {/* Glow ring */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
          />
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl"
            style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.5)", border: "4px solid rgba(245,158,11,0.2)" }}>
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&h=600&fit=crop"
              alt="Loaded Cheese Chicken Burger – FoodDen Special"
              className="w-full h-[480px] object-cover"
            />
            {/* Floating card */}
            <div
              className="absolute bottom-6 left-6 right-6 rounded-2xl p-4 backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-sm">Loaded Cheese Chicken Burger</p>
                  <p className="text-green-300 text-xs mt-0.5">⭐ 4.9 · 20 min delivery</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-black text-lg">₹249</p>
                  <p className="text-gray-400 text-xs line-through">₹329</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
