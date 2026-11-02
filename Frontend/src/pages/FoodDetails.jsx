import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiZap, FiShoppingCart, FiCheck, FiPlus, FiMinus } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api, { getFoods } from "../services/api";
import { foods as mockFoods } from "../data/mockData";
import { getCustomizationConfig } from "../components/CustomizeModal";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [food, setFood] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Customization state
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const notify = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      try {
        // Try getting single food
        let currentFood = null;
        let allFoods = [];
        try {
          const res = await api.get(`/foods/${id}`);
          currentFood = res.data?.data?.food || res.data?.food || res.data;
        } catch {
          // Fallback to getFoods list
          try {
            const { data } = await getFoods();
            allFoods = data?.data?.foods || data?.foods || data || [];
            currentFood = allFoods.find((f) => String(f._id) === String(id) || String(f.id) === String(id));
          } catch {
            allFoods = mockFoods;
          }
        }

        if (!currentFood) {
          const source = allFoods.length > 0 ? allFoods : mockFoods;
          currentFood = source.find((f) => String(f._id) === String(id) || String(f.id) === String(id));
        }

        if (currentFood) {
          setFood(currentFood);
          const catName = currentFood.category?.name || currentFood.category || "";
          const cfg = getCustomizationConfig(catName, currentFood.name);
          setSelectedSize(cfg.sizes[0]);
          setSelectedAddons([]);
          setQuantity(1);

          // Get related foods
          const pool = allFoods.length > 0 ? allFoods : mockFoods;
          const currentId = currentFood._id || currentFood.id;
          const rel = pool.filter(
            (f) =>
              (f.category?.name || f.category) === catName &&
              String(f._id || f.id) !== String(currentId)
          ).slice(0, 3);
          setRelated(rel);
        }
      } catch (err) {
        console.error("Error loading food details:", err);
        const fallback = mockFoods.find((f) => String(f._id) === String(id) || String(f.id) === String(id));
        if (fallback) setFood(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  const categoryName = food?.category?.name || food?.category || "Specialty";
  const config = useMemo(
    () => (food ? getCustomizationConfig(categoryName, food.name) : null),
    [categoryName, food]
  );

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.label === addon.label);
      return exists ? prev.filter((a) => a.label !== addon.label) : [...prev, addon];
    });
  };

  const basePrice = Number(food?.price) || 0;
  const sizeExtra = Number(selectedSize?.price) || 0;
  const addonsExtra = selectedAddons.reduce((sum, a) => sum + Number(a.price || 0), 0);
  const unitPrice = basePrice + sizeExtra + addonsExtra;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!user) {
      notify("Please login first to order.");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    if (user.role === "admin") {
      notify("Admin accounts cannot place orders.");
      return;
    }

    const customizationDesc = [
      selectedSize?.label,
      ...selectedAddons.map((a) => a.label),
    ].filter(Boolean).join(", ");

    const foodId = food._id || food.id;
    const uniqueId = `${foodId}-${customizationDesc || "std"}`;

    addItem({
      id: uniqueId,
      foodId: foodId,
      _id: foodId,
      name: food.name,
      price: unitPrice,
      image: food.image,
      category: categoryName,
      customization: customizationDesc || "Standard",
      quantity,
    });

    notify(`${food.name} added to cart! 🛒`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-5xl">🍽️</p>
          <p className="font-bold text-gray-700 text-xl">Item not found</p>
          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-2.5 rounded-full bg-green-700 text-white font-bold text-sm hover:bg-green-800 transition"
          >
            Back to Menu
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 font-semibold transition"
          >
            <FiArrowLeft size={16} /> Back to browsing
          </button>

          {message && (
            <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 font-bold text-sm shadow-sm animate-bounce">
              {message}
            </div>
          )}

          {/* Details Card */}
          <div className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6 md:p-8">
            {/* Image Section */}
            <div className="flex flex-col">
              <div className="relative rounded-2xl overflow-hidden h-80 bg-gray-100">
                <img
                  src={food.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
                {food.discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow">
                    -{food.discount}% OFF
                  </span>
                )}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow">
                  {food.isVeg ? "🟢 Pure Veg" : "🔴 Non-Veg"}
                </div>
              </div>

              {/* Meta stats */}
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div className="bg-gray-50 rounded-xl p-3">
                  <FiClock size={16} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 font-medium">Prep Time</p>
                  <p className="text-sm font-bold text-gray-800">{food.prepTime || "20 min"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <FiZap size={16} className="mx-auto text-amber-500 mb-1" />
                  <p className="text-xs text-gray-500 font-medium">Energy</p>
                  <p className="text-sm font-bold text-gray-800">{food.calories || 450} Cal</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-amber-400 text-base block mb-0.5">★</span>
                  <p className="text-xs text-gray-500 font-medium">Rating</p>
                  <p className="text-sm font-bold text-gray-800">{food.rating || 4.5} / 5</p>
                </div>
              </div>
            </div>

            {/* Customization & Order Info */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-700">
                  {categoryName}
                </span>
                <h1 className="text-3xl font-black text-gray-900 mt-1">{food.name}</h1>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{food.description}</p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl font-black text-green-700">
                    ₹{unitPrice.toLocaleString()}
                  </span>
                  {food.oldPrice > 0 && food.discount > 0 && (
                    <span className="text-base text-gray-400 line-through">
                      ₹{food.oldPrice.toLocaleString()}
                    </span>
                  )}
                  {sizeExtra > 0 && (
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                      Includes Size Upgrade (+₹{sizeExtra})
                    </span>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              {config && config.sizes && (
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                    {config.sizeLabel}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {config.sizes.map((s) => {
                      const isSelected = selectedSize?.label === s.label;
                      return (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition ${
                            isSelected
                              ? "border-green-600 bg-green-50 text-green-800 ring-2 ring-green-600"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <div>{s.label}</div>
                          <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                            {s.price === 0 ? "Standard" : `+₹${s.price}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Addons Selector */}
              {config && config.addons && (
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                    {config.addonsLabel}
                  </label>
                  <div className="space-y-2">
                    {config.addons.map((a) => {
                      const isChecked = selectedAddons.some((addon) => addon.label === a.label);
                      return (
                        <div
                          key={a.label}
                          onClick={() => toggleAddon(a)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                            isChecked
                              ? "border-amber-500 bg-amber-50/60 font-bold"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isChecked ? "border-amber-500 bg-amber-500 text-white" : "border-gray-300"
                              }`}
                            >
                              {isChecked && <FiCheck size={12} />}
                            </div>
                            <span>{a.label}</span>
                          </div>
                          <span className="text-amber-700 font-bold">+₹{a.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity + Add Button */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-gray-200 transition shadow-sm"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="font-black text-gray-900 w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-gray-200 transition shadow-sm"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-full font-bold text-white bg-green-700 hover:bg-green-800 transition shadow-lg shadow-green-700/20 active:scale-95 flex items-center justify-center gap-2 text-sm"
                >
                  <FiShoppingCart size={18} />
                  Add to Cart • ₹{totalPrice.toLocaleString()}
                </button>
              </div>
            </div>
          </div>

          {/* Related Dishes */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl font-black text-gray-900 mb-6">More in {categoryName}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((item) => {
                  const itemId = item._id || item.id;
                  return (
                    <div
                      key={itemId}
                      onClick={() => navigate(`/food/${itemId}`)}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex gap-4 items-center"
                    >
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200"}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-green-700 font-bold">{item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}</p>
                        <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                        <p className="text-sm font-black text-gray-900 mt-1">₹{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FoodDetails;