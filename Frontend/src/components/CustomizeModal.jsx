import { useState, useMemo } from "react";
import { FiX, FiCheck, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";

export const getCustomizationConfig = (categoryName = "", foodName = "") => {
  const cat = (categoryName || "").toLowerCase();
  const name = (foodName || "").toLowerCase();

  if (cat.includes("pizza") || name.includes("pizza")) {
    return {
      sizeLabel: "Choose Crust & Size",
      sizes: [
        { label: "Regular (7 inch)", price: 0 },
        { label: "Medium (10 inch)", price: 60 },
        { label: "Large (12 inch)", price: 120 },
      ],
      addonsLabel: "Extra Pizza Toppings",
      addons: [
        { label: "Extra Mozzarella Cheese", price: 45 },
        { label: "Jalapenos & Black Olives", price: 35 },
        { label: "Cheese Burst Crust", price: 65 },
      ],
    };
  }

  if (cat.includes("burger") || name.includes("burger")) {
    return {
      sizeLabel: "Choose Patty Option",
      sizes: [
        { label: "Single Patty", price: 0 },
        { label: "Double Patty (+Extra Fillet)", price: 70 },
      ],
      addonsLabel: "Burger Add-ons",
      addons: [
        { label: "Extra Cheese Slice", price: 25 },
        { label: "Spicy Peri Peri Mayo", price: 20 },
        { label: "Crispy Herb Hash Brown", price: 35 },
      ],
    };
  }

  if (cat.includes("fries") || cat.includes("side") || name.includes("fries") || name.includes("nuggets") || name.includes("bread")) {
    return {
      sizeLabel: "Choose Portion",
      sizes: [
        { label: "Regular Portion", price: 0 },
        { label: "Large / Jumbo Portion", price: 40 },
      ],
      addonsLabel: "Dips & Seasoning",
      addons: [
        { label: "Extra Peri Peri Sprinkler", price: 20 },
        { label: "Creamy Cheese Dip", price: 30 },
      ],
    };
  }

  return {
    sizeLabel: "Choose Size",
    sizes: [
      { label: "Regular (300 ml)", price: 0 },
      { label: "Large (500 ml)", price: 30 },
    ],
    addonsLabel: "Add-ons",
    addons: [
      { label: "Extra Ice & Lemon Slice", price: 10 },
      { label: "Flavour Burst Shot", price: 20 },
    ],
  };
};

const CustomizeModal = ({ food, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !food) return null;

  const categoryName = food.category?.name || food.category || "";
  const config = useMemo(() => getCustomizationConfig(categoryName, food.name), [categoryName, food.name]);

  const [selectedSize, setSelectedSize] = useState(config.sizes[0]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.label === addon.label);
      if (exists) {
        return prev.filter((a) => a.label !== addon.label);
      } else {
        return [...prev, addon];
      }
    });
  };

  const basePrice = Number(food.price) || 0;
  const sizeExtra = Number(selectedSize?.price) || 0;
  const addonsExtra = selectedAddons.reduce((sum, a) => sum + Number(a.price || 0), 0);
  const unitPrice = basePrice + sizeExtra + addonsExtra;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const customizationDesc = [
      selectedSize?.label,
      ...selectedAddons.map((a) => a.label),
    ].filter(Boolean).join(", ");

    onAddToCart({
      food,
      customization: customizationDesc,
      unitPrice,
      quantity,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-44 bg-gray-100 shrink-0">
          <img
            src={food.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 flex items-center justify-center shadow hover:bg-white transition"
          >
            <FiX size={18} />
          </button>
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow">
            {food.isVeg ? "🟢 Pure Veg" : "🔴 Non-Veg"}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                {categoryName}
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                Customizable
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mt-1">{food.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{food.description}</p>
          </div>

          {/* Size / Portion Selection */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2.5">
              {config.sizeLabel} <span className="text-red-500 text-xs">*Required</span>
            </h3>
            <div className="space-y-2">
              {config.sizes.map((s) => {
                const isSelected = selectedSize.label === s.label;
                return (
                  <label
                    key={s.label}
                    onClick={() => setSelectedSize(s)}
                    className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition ${
                      isSelected
                        ? "border-green-600 bg-green-50/60"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-green-600 bg-green-600" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-bold text-gray-800">{s.label}</span>
                    </div>
                    <span className="text-xs font-black text-gray-600">
                      {s.price === 0 ? "Standard" : `+₹${s.price}`}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Add-ons Selection */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2.5">
              {config.addonsLabel} <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </h3>
            <div className="space-y-2">
              {config.addons.map((a) => {
                const isChecked = selectedAddons.some((addon) => addon.label === a.label);
                return (
                  <label
                    key={a.label}
                    onClick={() => toggleAddon(a)}
                    className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition ${
                      isChecked
                        ? "border-amber-500 bg-amber-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                          isChecked ? "border-amber-500 bg-amber-500 text-white" : "border-gray-300"
                        }`}
                      >
                        {isChecked && <FiCheck size={14} />}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{a.label}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-700">+₹{a.price}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-700">Quantity</span>
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5">
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
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total</p>
            <p className="text-2xl font-black text-green-700">₹{totalPrice.toLocaleString()}</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-white bg-green-700 hover:bg-green-800 transition shadow-lg shadow-green-700/20 active:scale-95"
          >
            <FiShoppingBag size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeModal;
