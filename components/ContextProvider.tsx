"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Filter } from "./Post/Posts";


interface ContextProps {
  theme: string;
  setTheme: (theme: string) => void;
  filterBy: Filter;
  setFilterBy: (filter: Filter) => void;
  repoLink: string;
  setRepoLink: (link: string) => void;
}

const context = createContext<ContextProps>({
  theme: "default",
  setTheme: () => {},
  filterBy: { category: null },
  setFilterBy: () => {},
  repoLink: "string",
  setRepoLink: () => {},
});

export const useTheme = () => useContext(context);
export const useFilter = () => useContext(context);
export const useRepoLink = () => useContext(context);

export const ContextProvider = ({ initialTheme, children }: { initialTheme: string; children: ReactNode }) => {
  const [theme, setTheme] = useState(initialTheme);
  const [filterBy, setFilterBy] = useState<Filter>({ category: null });
  const [repoLink, setRepoLink] = useState("https://github.com/qazicopulous");


  return (
    <context.Provider value={{ theme, setTheme, filterBy, setFilterBy, repoLink, setRepoLink }}>
      {children}
    </context.Provider>
  );
};