export const APP_NAME = "CISM Stall";
export const APP_DESCRIPTION = "CISM Stall";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
} as const;

export const PUBLIC_ROUTE: string[] = [ROUTES.LOGIN];

export const VALUE = {
  HOME: "home",
  MANAGE: "manage",
  MONITOR: "monitor",
  ORDER: "order",
} as const;

export const API_ENDPOINTS = {
  STALL: {
    LOGIN: "/api/auth/stall/login",
    PROFILE: "/api/auth/stall/get-profile",
  },
  AUTH: {
    VALIDATE_COOKIE: "/api/auth/stall/validate-cookie",
    REFRESH_TOKEN: "/api/auth/stall/refresh-token",
  },
  MEAL: {
    CREATE: "/api/owner/stall/meal/create-new-meal",
    UPDATE: "/api/owner/stall/meal/update-meal/",
    DELETE: "/api/owner/stall/meal/delete-meal/",
  },
  SNACK: {
    CREATE: "/api/owner/stall/snack/create-new-snack",
    UPDATE: "/api/owner/stall/snack/update-snack/",
    DELETE: "/api/owner/stall/snack/delete-snack/",
  },
  DRINK: {
    CREATE: "/api/owner/stall/drink/create-new-drink",
    UPDATE: "/api/owner/stall/drink/update-drink/",
    DELETE: "/api/owner/stall/drink/delete-drink/",
  },

  REVIEW: {
    GETALL: "/api/review/review-get-all",
    DELETE_REVIEW: "/api/review/delete-review/",
  },
} as const;
