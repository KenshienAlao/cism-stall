import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Profile } from "@/model/profile.model";
import { useStallAnalytics } from "@/hooks/use-stall-analytics";
import { Star } from "lucide-react";

// --- Sub-components ---

const DashboardStat = ({ title, value, trend, percentage, subtitle }: {
    title: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
    percentage?: number;
    subtitle?: string;
}) => (
    <div className="p-6 bg-secondary/10 border border-border rounded-xl shadow-sm">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{title}</h4>
        <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl font-extrabold">{value}</span>
            {trend && (
                <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                    {trend === 'up' && <TrendingUp className="w-4 h-4" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4" />}
                    {trend === 'neutral' && <Minus className="w-4 h-4" />}
                    {percentage !== undefined && `${percentage}%`}
                </div>
            )}
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mt-3 font-medium">{subtitle}</p>}
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-lg font-bold mb-4 px-1 text-foreground/80">{title}</h3>
);

// --- Main Component ---

export function Dashboard({ profile }: { profile?: Profile }) {
    const { analyzedItems, stats } = useStallAnalytics(profile);

    const topSellers = [...analyzedItems]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 5);

    return (
        <div className="p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardStat
                    title="Revenue (7D)"
                    value={`₱${stats.revenue.toLocaleString()}`}
                    trend={stats.revenueTrend?.trend}
                    percentage={stats.revenueTrend?.percentageChange}
                    subtitle={`Prev: ₱${stats.revenueTrend?.previousPeriodTotal.toLocaleString() || 0}`}
                />
                <DashboardStat
                    title="Total Sales"
                    value={stats.totalSold}
                    subtitle={`${analyzedItems.length} active items in inventory`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Top Sellers */}
                <section>
                    <SectionHeader title="Top Selling Items" />
                    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-secondary/20 border-b border-border">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Item</th>
                                    <th className="px-5 py-3 font-semibold text-center">Units</th>
                                    <th className="px-5 py-3 font-semibold text-right">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {topSellers.map((item, i) => (
                                    <tr key={i} className="hover:bg-secondary/5 transition-colors">
                                        <td className="px-5 py-4 font-medium">{item.name}</td>
                                        <td className="px-5 py-4 text-center font-bold">{item.sold}</td>
                                        <td className="px-5 py-4 text-right">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.trend === 'up' ? 'bg-green-100 text-green-700' :
                                                    item.trend === 'down' ? 'bg-red-100 text-red-700' :
                                                        'bg-secondary text-muted-foreground'
                                                }`}>
                                                {item.trend === 'up' && '▲'}
                                                {item.trend === 'down' && '▼'}
                                                {item.salesChange}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Performance Overview */}
                <section>
                    <SectionHeader title="Performance Overview" />
                    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-secondary/20 border-b border-border">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Category</th>
                                    <th className="px-5 py-3 font-semibold">Item</th>
                                    <th className="px-5 py-3 font-semibold text-right">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {analyzedItems.slice(0, 5).map((item, i) => (
                                    <tr key={i} className="hover:bg-secondary/5 transition-colors">
                                        <td className="px-5 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${(item.sold || 0) > 50 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-medium truncate max-w-30">{item.name}</td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5 font-bold">
                                                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                                {item.avgRating.toFixed(1)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}