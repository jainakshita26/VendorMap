import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import useAnalytics from "../hooks/useAnalytics";

const StatCard = ({ label, value, sub, color = "blue" }) => {
  const colors = {
    blue:   "bg-blue-50 text-blue-600",
    green:  "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-700",
    amber:  "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colors[color].split(" ")[1]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />
);

const AnalyticsDashboard = ({ shop }) => {
  const { analytics, loading, error } = useAnalytics(!!shop);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse" />
      <div className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse" />
    </div>
  );

  if (error) return (
    <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
      {error}
    </div>
  );

  if (!analytics) return null;

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total views"
          value={analytics.totalViews}
          sub="All time"
          color="blue"
        />
        <StatCard
          label="This week"
          value={analytics.weekViews}
          sub="Last 7 days"
          color="green"
        />
        <StatCard
          label="This month"
          value={analytics.monthViews}
          sub="Last 30 days"
          color="purple"
        />
        <StatCard
          label="Total products"
          value={analytics.totalProducts}
          sub={`★ ${analytics.averageRating} · ${analytics.reviewCount} reviews`}
          color="amber"
        />
      </div>

      {/* Views last 7 days — line chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Views — last 7 days
        </h3>
        {analytics.viewsByDay.every((d) => d.views === 0) ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <span className="text-3xl mb-2">📊</span>
            <p className="text-sm text-gray-500">No views yet this week</p>
            <p className="text-xs text-gray-400 mt-1">Views appear when customers visit your shop page</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.viewsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                formatter={(v) => [v, "Views"]}
              />
              <Line
                type="monotone" dataKey="views"
                stroke="#2563eb" strokeWidth={2}
                dot={{ fill: "#2563eb", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Peak hours — bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          Peak hours
        </h3>
        <p className="text-xs text-gray-400 mb-4">When customers visit your shop (last 30 days)</p>
        {analytics.peakHours.every((h) => h.views === 0) ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <span className="text-3xl mb-2">🕐</span>
            <p className="text-sm text-gray-500">No data yet</p>
            <p className="text-xs text-gray-400 mt-1">Peak hours appear after customers visit your shop</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                interval={2}
              />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                formatter={(v) => [v, "Views"]}
              />
              <Bar dataKey="views" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
};

export default AnalyticsDashboard;