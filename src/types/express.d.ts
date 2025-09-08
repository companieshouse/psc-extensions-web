import "express";

declare global {
  namespace Express {
    interface Request {
      lang: string;
    }
  }
}

export {};
