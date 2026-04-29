export type Income = {
  id?: string;
  stallId?: number;
  income: number;
  earnedAt?: string;
  createdAt?: string;
};

export const initIncome: Income = {
  income: 0,
};
