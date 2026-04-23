import { useState } from "react";
import useVendorShop from "../hooks/useVendorShop";
import useAuth from "../../auth/hooks/useAuth";
import CreateShopForm from "../components/CreateShopForm";
import AddProductForm from "../components/AddProductForm";
import VendorProductCard from "../components/VendorProductCard";
import EditShopForm from "../components/EditShopForm";
import ShopHoursForm from "../components/ShopHoursForm";
import AnalyticsDashboard from "../components/AnalyticsDashboard"; // ← new

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-32 bg-gray-200 rounded-2xl" />
    <div className="h-64 bg-gray-200 rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-56 bg-gray-200 rounded-2xl" />
      ))}
    </div>
  </div>
);

// helper — groups consecutive days with same hours
const groupHours = (hours) => {
  if (!hours?.length) return [];

  const groups = [];
  let i = 0;

  while (i < hours.length) {
    const current = hours[i];
    let j = i + 1;

    // find consecutive days with same open/close/isClosed
    while (
      j < hours.length &&
      hours[j].open === current.open &&
      hours[j].close === current.close &&
      hours[j].isClosed === current.isClosed
    ) {
      j++;
    }

    const span = hours.slice(i, j);
    if (span.length === 1) {
      groups.push({ label: span[0].day.slice(0, 3), ...current });
    } else {
      groups.push({
        label: `${span[0].day.slice(0, 3)} – ${span[span.length - 1].day.slice(0, 3)}`,
        ...current,
      });
    }
    i = j;
  }

  return groups;
};

const ShopInfoPanel = ({ shop, onEditClick, onHoursClick, onToggleClosed }) => {
  const hourGroups = groupHours(shop.hours);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Banner */}
      <div className="w-full h-36 bg-gray-100 overflow-hidden relative">
        {shop.shopImage ? (
          <img src={shop.shopImage} alt={shop.shopName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-50">
            <span className="text-5xl">🏪</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button onClick={onHoursClick}
            className="bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 transition">
            🕐 Hours
          </button>
          <button onClick={onEditClick}
            className="bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 transition">
            ✏️ Edit
          </button>
        </div>
      </div>

      <div className="p-5 space-y-3">

        {/* Name + category + close toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-gray-800">{shop.shopName}</h2>
            {shop.category && (
              <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-1 rounded-full">
                {shop.category}
              </span>
            )}
          </div>
          <button
            onClick={onToggleClosed}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition shrink-0 ${
              shop.temporarilyClosed
                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${shop.temporarilyClosed ? "bg-red-500" : "bg-green-500"}`} />
            {shop.temporarilyClosed ? "Mark as Open" : "Close for Today"}
          </button>
        </div>

        {/* Temporary closure warning */}
        {shop.temporarilyClosed && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
            ⚠️ Your shop is currently marked as closed for today.
          </div>
        )}

        {shop.description && (
          <p className="text-sm text-gray-500">{shop.description}</p>
        )}

        {/* ── Improved hours display ── */}
        {hourGroups.length > 0 && (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Opening Hours
              </span>
              <button
                onClick={onHoursClick}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Edit
              </button>
            </div>

            {/* Hours rows */}
            <div className="divide-y divide-gray-50">
              {hourGroups.map((group, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span className="text-sm text-gray-700 font-medium w-28">
                    {group.label}
                  </span>
                  {group.isClosed ? (
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                      Closed
                    </span>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {group.open} – {group.close}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location + owner */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {shop.location?.address && (
            <span className="flex items-center gap-1">
              <span>📍</span>{shop.location.address}
            </span>
          )}
          <span className="flex items-center gap-1">
            <span>👤</span>{shop.owner?.name}
          </span>
        </div>

      </div>
    </div>
  );
};

const VendorDashboard = () => {
  const { user } = useAuth();
  const [activeTab,      setActiveTab]      = useState("products"); // ← new
  const [isEditingShop,  setIsEditingShop]  = useState(false);
  const [isEditingHours, setIsEditingHours] = useState(false);

  const {
    shop, products, loading, error,
    handleCreateShop, handleUpdateShop, handleUpdateHours,
    handleToggleTemporaryClosed,
    handleAddProduct, handleUpdateProduct, handleDeleteProduct,
  } = useVendorShop();

  const tabs = [
    { id: "products",  label: "Products",  emoji: "📦" },
    { id: "analytics", label: "Analytics", emoji: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && <DashboardSkeleton />}

        {!loading && error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && !shop && (
          <CreateShopForm onSubmit={handleCreateShop} />
        )}

        {!loading && !error && shop && (
          <div className="space-y-6">

            <ShopInfoPanel
              shop={shop}
              onEditClick={() => { setIsEditingShop(true); setIsEditingHours(false); }}
              onHoursClick={() => { setIsEditingHours(true); setIsEditingShop(false); }}
              onToggleClosed={handleToggleTemporaryClosed}
            />

            {isEditingShop && (
              <EditShopForm shop={shop} onSubmit={handleUpdateShop}
                onClose={() => setIsEditingShop(false)} />
            )}
            {isEditingHours && (
              <ShopHoursForm shop={shop} onSubmit={handleUpdateHours}
                onClose={() => setIsEditingHours(false)} />
            )}

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* ── Products tab ── */}
            {activeTab === "products" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <AddProductForm onSubmit={handleAddProduct} />
                </div>
                <div className="lg:col-span-2">
                  <h3 className="text-base font-semibold text-gray-800 mb-4">
                    Your Products{" "}
                    <span className="text-gray-400 font-normal text-sm">
                      ({products.length})
                    </span>
                  </h3>
                  {products.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 bg-white rounded-2xl border border-gray-100 text-center">
                      <span className="text-4xl mb-3">📦</span>
                      <p className="text-sm font-medium text-gray-600">No products yet</p>
                      <p className="text-xs text-gray-400 mt-1">Add your first product using the form</p>
                    </div>
                  )}
                  {products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {products.map((product) => (
                        <VendorProductCard
                          key={product._id}
                          product={product}
                          onUpdate={handleUpdateProduct}
                          onDelete={handleDeleteProduct}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Analytics tab ── */}
            {activeTab === "analytics" && (
              <AnalyticsDashboard shop={shop} />
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;