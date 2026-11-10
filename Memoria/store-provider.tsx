"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/lib/types";

type StoreContextValue = {
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  hasMemoria: boolean;
  isCartOpen: boolean;
  isCartReady: boolean;
  addLine: (line: Omit<CartLine, "lineId">) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_STORAGE_KEY = "hilomio-cart-v2";

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.lineId === "string" &&
    (line.kind === "producto" || line.kind === "memoria") &&
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.image === "string" &&
    typeof line.unitPrice === "number" &&
    typeof line.quantity === "number" &&
    line.quantity > 0
  );
}

function lineKey(line: Omit<CartLine, "lineId">) {
  return [line.kind, line.slug, line.variant ?? "", line.engraving ?? "", line.design ? JSON.stringify(line.design) : ""].join("|");
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setCart(parsed.filter(isCartLine));
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage unavailable: the cart still works for this visit.
    }
  }, [cart, hasHydrated]);

  const addLine = useCallback((line: Omit<CartLine, "lineId">) => {
    setCart((current) => {
      const key = lineKey(line);
      const existing = current.find((item) => lineKey(item) === key);
      if (existing) {
        return current.map((item) =>
          item.lineId === existing.lineId ? { ...item, quantity: item.quantity + line.quantity } : item,
        );
      }
      const lineId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      return [...current, { ...line, lineId }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setCart((current) =>
      quantity < 1
        ? current.filter((item) => item.lineId !== lineId)
        : current.map((item) => (item.lineId === lineId ? { ...item, quantity: Math.min(quantity, 12) } : item)),
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setCart((current) => current.filter((item) => item.lineId !== lineId));
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(
    () => ({
      cart,
      cartCount: cart.reduce((total, item) => total + item.quantity, 0),
      subtotal: cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
      hasMemoria: cart.some((item) => item.kind === "memoria"),
      isCartOpen,
      isCartReady: hasHydrated,
      addLine,
      updateQuantity,
      removeLine,
      openCart,
      closeCart,
      clearCart,
    }),
    [cart, isCartOpen, hasHydrated, addLine, updateQuantity, removeLine, openCart, closeCart, clearCart],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
