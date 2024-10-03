import { createContext } from "react";

interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
export const maincontainer = createContext<MainContainerContext | null>(null);
