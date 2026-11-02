import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { id: 1, name: "Pizza",             filter: "Pizza",              icon: "🍕", count: "6+ items", color: "#fff4e6", iconBg: "#f97316" },
  { id: 2, name: "Burgers",           filter: "Burgers",            icon: "🍔", count: "8+ items", color: "#f0fdf4", iconBg: "#16a34a" },
  { id: 3, name: "Fries & Sides",     filter: "Fries & Sides",      icon: "🍟", count: "6+ items", color: "#fefce8", iconBg: "#ca8a04" },
  { id: 4, name: "Sandwiches & Wraps",filter: "Sandwiches & Wraps", icon: "🥪", count: "3+ items", color: "#fdf2f8", iconBg: "#db2777" },
  { id: 5, name: "Italian Pasta",     filter: "Pasta",              icon: "🍝", count: "2+ items", color: "#fef2f2", iconBg: "#ef4444" },
  { id: 6, name: "Fresh Salads",      filter: "Fresh Salads",       icon: "🥗", count: "3+ items", color: "#ecfdf5", iconBg: "#059669" },
  { id: 7, name: "Desserts & Treats", filter: "Desserts & Treats",  icon: "🍰", count: "4+ items", color: "#fff1f2", iconBg: "#e11d48" },
  { id: 8, name: "Beverages & Shakes",filter: "Beverages",          icon: "🥤", count: "7+ items", color: "#eff6ff", iconBg: "#2563eb" },
];

const CategorySection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (filterName) => {
    navigate("/menu", { state: { category: filterName } });
  };

  return (
    <section className="py-16 px-4" style={{ backgroundColor: "#eef7ee" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-amber)" }}>
              — All Categories —
            </p>
            <h2 className="text-4xl font-black text-gray-900">
              Explore Delicious Cuisine<br />by Category
            </h2>
          </div>
          <p className="text-gray-500 max-w-xs">
            Browse our complete menu — from artisan pizzas and loaded burgers to creamy pastas, crispy sides, fresh salads, desserts and chilled shakes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.filter)}
              className="rounded-3xl p-5 text-center shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 group cursor-pointer border border-transparent hover:border-green-100"
              style={{ backgroundColor: cat.color }}
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-md"
                style={{ backgroundColor: cat.iconBg }}
              >
                {cat.icon}
              </div>
              <h3 className="text-sm font-black text-gray-800 leading-tight">{cat.name}</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">{cat.count}</p>
            </button>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/menu")}
            className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 shadow-md"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            View Full Menu ({33}+ Dishes) →
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
