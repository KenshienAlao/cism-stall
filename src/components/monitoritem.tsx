import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Profile } from '@/model/profile.model';
import { useStallAnalytics, AnalyzedItem } from '@/hooks/use-stall-analytics';

// --- Sub-components ---

const StatCard = ({ title, value, subtitle, children }: { title: string; value: string | number; subtitle: string; children?: React.ReactNode }) => (
  <div className="p-6 bg-secondary/10 border border-border rounded-xl shadow-sm">
    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{title}</h4>
    <div className="flex items-center gap-3">
      <span className="text-3xl font-bold">{value}</span>
      {children}
    </div>
    <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
  </div>
);

const StarRating = ({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`${size} ${s <= Math.round(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground/20'}`}
      />
    ))}
  </div>
);

// --- Main Component ---

export function MonitorItem({ profile }: { profile: Profile | undefined }) {
  const [selectedItem, setSelectedItem] = useState<AnalyzedItem | null>(null);
  const { analyzedItems, stats } = useStallAnalytics(profile);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Total Reviews" value={stats.totalReviews} subtitle="Across all stall items" />
        <StatCard title="Stall Rating" value={stats.avgStallRating.toFixed(1)} subtitle="Based on customer feedback">
          <StarRating rating={stats.avgStallRating} size="w-5 h-5" />
        </StatCard>
      </div>

      {/* Items Table */}
      <section>
        <h3 className="text-xl font-bold mb-4 px-1">Items Performance</h3>
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/20 border-b border-border">
                <th className="px-6 py-4 font-semibold text-sm">Item Name</th>
                <th className="px-6 py-4 font-semibold text-sm">Average Rating</th>
                <th className="px-6 py-4 font-semibold text-sm">Total Reviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {analyzedItems.length > 0 ? (
                analyzedItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-secondary/10 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StarRating rating={item.avgRating} />
                        <span className="text-sm font-medium">{item.avgRating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.totalReviews} reviews</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground italic">No items found to monitor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-background w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <header className="px-6 py-5 border-b border-border flex justify-between items-center bg-secondary/5">
              <div>
                <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={selectedItem.avgRating} />
                  <span className="text-sm font-semibold text-muted-foreground">({selectedItem.totalReviews} reviews)</span>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]">
              {selectedItem.reviews.length > 0 ? (
                selectedItem.reviews.map((review) => (
                  <article key={review.id} className="p-4 rounded-xl bg-secondary/10 border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold">User #{review.userId}</span>
                      <time className="text-xs text-muted-foreground">{new Date(review.createAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                    </div>
                    <StarRating rating={review.star} size="w-3 h-3" />
                    <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{review.comment}</p>
                  </article>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground italic">No reviews yet for this item.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
