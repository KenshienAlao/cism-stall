export const APP_NAME = "CISM Stall";
export const APP_DESCRIPTION = "CISM Stall";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
} as const;

export const PUBLIC_ROUTE: string[] = [ROUTES.LOGIN];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/stall/login",
  },
};
