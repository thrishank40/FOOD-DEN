import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiSliders, FiCheckCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomizeModal from "../components/CustomizeModal";
import { getFoods } from "../services/api";
import { foods as mockFoods } from "../data/mockData";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFavourite } from "../context/FavouriteContext";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toggleFavourite, isFavourite } = useFavourite();

  const [foods,            setFoods]            = useState([]);
  const [search,           setSearch]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || "All");
  const [dietFilter,       setDietFilter]       = useState("all"); // "all" | "veg" | "nonveg"
  const [sortBy,           setSortBy]           = useState("featured"); // "featured" | "price-asc" | "price-desc" | "rating"
  const [loading,          setLoading]          = useState(true);
  const [message,          setMessage]          = useState({ text: "", type: "success" });
  const [customizingFood,  setCustomizingFood]  = useState(null);

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const { data } = await getFoods();
        const foodData = data?.data?.foods || data?.foods || data?.data || data || [];
        if (Array.isArray(foodData) && foodData.length > 0) {
          setFoods(foodData);
        } else {
          setFoods(mockFoods);
        }
      } catch (error) {
        console.warn("Backend API unavailable, using cached food items:", error);
        setFoods(mockFoods);
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  const notify = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
  };

  const categories = useMemo(() => {
    const names = foods.map((f) => f.category?.name || f.category || "Food");
    return ["All", ...new Set(names.filter(Boolean))];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods
      .filter((food) => {
        const cat = String(food.category?.name || food.category || "Food");
        const q = search.trim().toLowerCase();
        const matchSearch =
          !q ||
          food.name?.toLowerCase().includes(q) ||
          food.description?.toLowerCase().includes(q) ||
          cat.toLowerCase().includes(q);
        const matchCat =
          selectedCategory === "All" ||
          cat.toLowerCase() === selectedCategory.toLowerCase() ||
          cat.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(cat.toLowerCase());

        let matchDiet = true;
        if (dietFilter === "veg") matchDiet = food.isVeg === true;
        if (dietFilter === "nonveg") matchDiet = food.isVeg === false;

        return matchSearch && matchCat && matchDiet;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return 0; // featured
      });
  }, [foods, search, selectedCategory, dietFilter, sortBy]);

  const handleDirectAddToCart = (food) => {
    if (!user) {
      notify("Please login first to add items to cart.", "error");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    if (user.role === "admin") {
      notify("Admin accounts cannot place orders.", "error");
      return;
    }

    const baseId = food._id || food.id;
    addItem({
      id: baseId,
      foodId: baseId,
      _id: baseId,
      name: food.name,
      price: food.price,
      image: food.image,
      category: food.category?.name || food.category || "Food",
      customization: "Standard",
      quantity: 1,
    });
    notify(`${food.name} added to cart! 🛒`);
  };

  const handleCustomizedAddToCart = ({ food, customization, unitPrice, quantity }) => {
    if (!user) {
      notify("Please login first to add items to cart.", "error");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    if (user.role === "admin") {
      notify("Admin accounts cannot place orders.", "error");
      return;
    }

    const baseId = food._id || food.id;
    const uniqueId = `${baseId}-${customization || "std"}`;
    addItem({
      id: uniqueId,
      foodId: baseId,
      _id: baseId,
      name: food.name,
      price: unitPrice,
      image: food.image,
      category: food.category?.name || food.category || "Food",
      customization: customization || "Standard",
      quantity: quantity || 1,
    });
    notify(`${food.name} added to cart! 🛒`);
  };

  const handleToggleFavourite = (e, food) => {
    e.stopPropagation();
    if (!user) {
      notify("Please login to save favourites.", "error");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    toggleFavourite(food._id || food.id);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-cream, #f9fafb)" }}>
      <Navbar />

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Our Fresh Menu</h1>
              <p className="text-gray-500 mt-1">Explore authentic pizzas, loaded burgers, crunchy sides and refreshing sips.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fast Delivery</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-black rounded-full flex items-center gap-1">
                <FiCheckCircle size={13} /> 30-Min Promise
              </span>
            </div>
          </div>
        </div>

        {/* Floating Notification */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-semibold shadow-sm transition-all animate-bounce ${
            message.type === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-8 space-y-4">
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food items, pizzas, burgers, shakes..."
                className="w-full pl-4 pr-10 py-3 rounded-2xl border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 text-sm transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-3.5 text-xs text-gray-400 hover:text-gray-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <FiSliders size={13} /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl px-3 py-3 outline-none focus:border-green-600 cursor-pointer"
              >
                <option value="featured">Featured / Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated ★</option>
              </select>
            </div>
          </div>

          {/* Categories and Diet Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                    selectedCategory === cat
                      ? "bg-green-700 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Diet toggle buttons (Veg / Non-veg) */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => setDietFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  dietFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietFilter("veg")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  dietFilter === "veg" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-green-700"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" />
                Pure Veg
              </button>
              <button
                onClick={() => setDietFilter("nonveg")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  dietFilter === "nonveg" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-red-600"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                Non-Veg
              </button>
            </div>
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-black text-gray-900">
            {selectedCategory === "All" ? "All Specialties" : selectedCategory}
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({filteredFoods.length} {filteredFoods.length === 1 ? "item" : "items"})
            </span>
          </h2>
          {(dietFilter !== "all" || search) && (
            <button
              onClick={() => { setDietFilter("all"); setSearch(""); setSelectedCategory("All"); }}
              className="text-xs text-green-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl shadow overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 max-w-lg mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-black text-gray-800">No dishes match your filter</h3>
            <p className="text-gray-500 mt-2 text-sm">
              We couldn't find any dishes matching "{search || dietFilter}". Try adjusting your search keyword or diet preference.
            </p>
            <button
              onClick={() => { setSearch(""); setDietFilter("all"); setSelectedCategory("All"); }}
              className="mt-5 px-6 py-2.5 bg-green-700 text-white rounded-full font-bold text-sm hover:bg-green-800 transition"
            >
              Show All Menu
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => {
              const fav = isFavourite(food._id);
              const isAvailable = food.isAvailable !== false && food.availability !== false;

              return (
                <div
                  key={food._id}
                  className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group ${
                    !isAvailable ? "opacity-60 grayscale-[40%]" : ""
                  }`}
                >
                  {/* Food Image + Badges */}
                  <div className="relative overflow-hidden h-48 bg-gray-100">
                    <img
                      src={food.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"}
                      alt={food.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Veg / Non-Veg Indicator */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center ${food.isVeg ? "border-green-600" : "border-red-600"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                      </div>
                      <span className="text-[10px] font-black uppercase text-gray-700 tracking-wider">
                        {food.isVeg ? "Veg" : "Non-Veg"}
                      </span>
                    </div>

                    {/* Discount badge */}
                    {food.discount > 0 && (
                      <span className="absolute bottom-3 left-3 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow">
                        -{food.discount}% OFF
                      </span>
                    )}

                    {/* Favourite button */}
                    <button
                      onClick={(e) => handleToggleFavourite(e, food)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-95 ${
                        fav ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <FiHeart size={15} fill={fav ? "white" : "none"} />
                    </button>

                    {/* Out of stock overlay */}
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-green-700 uppercase tracking-wider">
                        {food.category?.name || "Food"}
                      </span>
                      {food.rating > 0 && (
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-amber-700 font-bold">
                          <span>★</span>
                          <span>{food.rating}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-base font-black text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
                      {food.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 flex-1 leading-relaxed">
                      {food.description || "Fresh and delicious restaurant specialty."}
                    </p>

                    {/* Price row */}
                    <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xl font-black text-gray-900">
                        ₹{food.price?.toLocaleString()}
                      </span>
                      {food.oldPrice > 0 && food.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{food.oldPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button
                        onClick={() => setCustomizingFood(food)}
                        disabled={!isAvailable}
                        className="w-full py-2 px-2 rounded-xl text-xs font-bold border border-green-600 text-green-700 hover:bg-green-50 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-center"
                      >
                        Customize ⚙️
                      </button>

                      <button
                        onClick={() => handleDirectAddToCart(food)}
                        disabled={!isAvailable}
                        className="w-full py-2 px-2 rounded-xl text-xs font-bold text-white bg-green-700 hover:bg-green-800 transition active:scale-95 flex items-center justify-center gap-1 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FiShoppingCart size={13} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Food Customization Modal */}
      <CustomizeModal
        food={customizingFood}
        isOpen={Boolean(customizingFood)}
        onClose={() => setCustomizingFood(null)}
        onAddToCart={handleCustomizedAddToCart}
      />

      <Footer />
    </div>
  );
};

export default Menu;