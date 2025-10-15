import "express";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      lang?: string;
    }
  }
}

export {};
