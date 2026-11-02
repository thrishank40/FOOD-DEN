import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavourite } from "../context/FavouriteContext";
import { getFoods } from "../services/api";
import { foods as mockFoods } from "../data/mockData";

const DealCard = ({ food }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toggleFavourite, isFavourite } = useFavourite();
  const foodId = food._id || food.id;
  const fav = isFavourite(foodId);

  const handleAdd = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addItem({
      id: foodId,
      _id: foodId,
      name: food.name,
      price: food.price,
      image: food.image,
      quantity: 1,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-card hover:shadow-hover transition-all duration-300 flex gap-4 items-center">
      <div className="relative shrink-0">
        <img
          src={food.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"}
          alt={food.name}
          className="w-20 h-20 rounded-xl object-cover"
        />
        <span
          className="absolute -top-2 -left-2 w-10 h-10 rounded-full text-white text-xs font-black flex items-center justify-center"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          -{food.discount || 20}%
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
              {food.name}
            </h4>
            {food.rating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-amber-400 text-xs">★</span>
                <span className="text-xs font-semibold text-gray-600">
                  {food.rating}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (!user) {
                navigate("/login");
                return;
              }
              toggleFavourite(foodId);
            }}
            className={`transition-colors ${
              fav ? "text-red-500" : "text-gray-300 hover:text-red-400"
            }`}
          >
            <FiHeart size={16} fill={fav ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-sm font-black"
            style={{ color: "var(--color-primary)" }}
          >
            ₹{food.price?.toLocaleString()}
          </span>
          {food.oldPrice > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ₹{food.oldPrice?.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <FiShoppingCart size={12} />
          {user ? "Add to Cart" : "Login to Order"}
        </button>
      </div>
    </div>
  );
};

const DealsSection = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getFoods();
        const all = data?.data?.foods || data?.foods || data?.data || data || [];
        const source = Array.isArray(all) && all.length > 0 ? all : mockFoods;
        const filtered = source
          .filter((f) => (f.discount || 0) >= 15)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, 6);
        setDeals(filtered.length > 0 ? filtered : source.slice(0, 6));
      } catch (err) {
        console.warn("DealsSection API fallback:", err);
        const filtered = mockFoods
          .filter((f) => (f.discount || 0) >= 15)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, 6);
        setDeals(filtered);
      }
    };
    load();
  }, []);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-2"
          style={{ color: "#ef4444" }}
        >
          ⚡ Limited Time
        </p>
        <h2 className="text-4xl font-black text-gray-900">
          Flash Deals: Ending Soon!
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {deals.map((food) => (
          <DealCard key={food._id || food.id} food={food} />
        ))}
      </div>
    </section>
  );
};

export default DealsSection;