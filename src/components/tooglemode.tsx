"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
const Tooglemode = () => {
  const { theme, setTheme } = useTheme();
  const [monted, setmounted] = useState(false);
  useEffect(() => {
    setmounted(true);
  }, []);

  const dark = theme == "dark";
  return (
    <div>
      <button onClick={() => setTheme(`${dark ? "light" : "dark"}`)}>
        {dark ? <Moon /> : <Sun />}
      </button>
    </div>
  );
};

export default Tooglemode;
