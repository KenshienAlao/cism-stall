import { Item } from "./item.model";
import { Income } from "./income.model";
import { Review } from "./review.model";

export type Profile = {
  id?: number;
  user: Stall;
  meals: Item[];
  snacks: Item[];
  drinks: Item[];
  reviews: Review[];
  incomes: Income;
  revenueTrend: Trend;
};

export type Trend = {
  currentPeriodTotal: number;
  previousPeriodTotal: number;
  percentageChange: number;
  trend: "up" | "down" | "neutral";
};

export type Stall = {
  id?: number;
  stallId?: number;
  name: string;
  description: string;
  image: string;
  status: boolean;
  openAt: string;
  closeAt: string;
  createdAt: string;
  updatedAt: string;
};
