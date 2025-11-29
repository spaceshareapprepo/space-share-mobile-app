// drawer-context.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type DrawerCtx = { isOpen: boolean; openDrawer: () => void; closeDrawer: () => void };
const Ctx = createContext<DrawerCtx | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <Ctx.Provider value={{ isOpen, openDrawer: () => setOpen(true), closeDrawer: () => setOpen(false) }}>
      {children}
    </Ctx.Provider>
  );
}
export const useDrawer = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDrawer must be used within DrawerProvider");
  return ctx;
};
