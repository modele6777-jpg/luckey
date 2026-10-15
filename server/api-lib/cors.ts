import type { Response } from "express";

export function applyCors(res: Response): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-stainless-sdk-version, x-stainless-os, x-stainless-lang, x-stainless-runtime, x-stainless-runtime-version, x-stainless-helper-method, x-stainless-package-version",
  );
}