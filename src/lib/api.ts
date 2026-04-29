export type ApiResponse<T> =
  | {
      data: T;
      message: string;
      status: number;
      success: boolean;
    }
  | {
      data: null;
      message: string;
      status: number;
      success: boolean;
    };
