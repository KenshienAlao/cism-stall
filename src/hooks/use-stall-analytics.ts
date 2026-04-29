import { useMemo } from 'react';
import { Profile } from '@/model/profile.model';
import { Item } from '@/model/item.model';
import { Review } from '@/model/review.model';

export interface AnalyzedItem extends Item {
  avgRating: number;
  totalReviews: number;
  reviews: Review[];
  type: 'Meal' | 'Snack' | 'Drink';
  trend: 'up' | 'down' | 'neutral';
  salesChange: number;
}

export function useStallAnalytics(profile: Profile | undefined) {
  const allItems = useMemo(() => {
    if (!profile) return [];
    return [
      ...(profile.meals || []).map(i => ({ ...i, type: 'Meal' as const })),
      ...(profile.snacks || []).map(i => ({ ...i, type: 'Snack' as const })),
      ...(profile.drinks || []).map(i => ({ ...i, type: 'Drink' as const })),
    ];
  }, [profile]);

  const reviewsMap = useMemo(() => {
    const map = new Map<number, Review[]>();
    (profile?.reviews || []).forEach(r => {
      const id = Number(r.itemId);
      if (!map.has(id)) map.set(id, []);
      map.get(id)!.push(r);
    });
    return map;
  }, [profile?.reviews]);

  const analyzedItems = useMemo(() => {
    return allItems.map(item => {
      const itemReviews = reviewsMap.get(Number(item.id)) || [];
      const totalReviews = itemReviews.length;
      const avgRating = totalReviews > 0
        ? itemReviews.reduce((sum, r) => sum + r.star, 0) / totalReviews
        : 0;

      const diff = (item.sold || 0) - (item.previousSold || 0);
      const salesChange = item.previousSold ? Math.round((Math.abs(diff) / item.previousSold) * 100) : 0;

      return {
        ...item,
        avgRating,
        totalReviews,
        reviews: itemReviews,
        trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
        salesChange
      };
    }) as AnalyzedItem[];
  }, [allItems, reviewsMap]);

  const stats = useMemo(() => {
    const reviews = profile?.reviews || [];
    return {
      totalReviews: reviews.length,
      avgStallRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.star, 0) / reviews.length 
        : 0,
      totalSold: allItems.reduce((sum, i) => sum + (i.sold || 0), 0),
      revenue: profile?.revenueTrend?.currentPeriodTotal || 0,
      revenueTrend: profile?.revenueTrend
    };
  }, [profile, allItems]);

  return { analyzedItems, stats };
}
