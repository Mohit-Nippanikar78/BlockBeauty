import { useEffect, useState } from "react";

export const serverUrl = "http://localhost:3000";
//export const serverUrl = import.meta.env.VITE_SERVER_URL;
export const toggleDarkClasses = (action) => {
  if (action.payload === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
};
export const useOutsideClick = (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};
export function copy(text) {
  navigator.clipboard.writeText(text);
}
export function useDebounce() {
  const [timer, setTimer] = useState("");
  function debounce(func, wait = 500) {
    clearTimeout(timer);
    const timeout = setTimeout(() => func(), wait);
    setTimer(timeout);
  }
  return debounce;
}
