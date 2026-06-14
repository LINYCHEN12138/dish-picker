"use client";

import { useMenu } from "@/providers/menu-provider";

export function useRandomDish() {
  const { randomize } = useMenu();
  return { randomize };
}
