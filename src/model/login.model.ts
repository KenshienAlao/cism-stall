export type LoginRequest = {
  licence: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  stall: {
    id: string;
    name: string;
    image: string;
  };
};

export const initLogin: LoginRequest = {
  licence: "",
  password: "",
};
