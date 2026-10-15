import { useEffect, DependencyList } from "react";
import { resetAppScroll } from "@/utils/scrollToTop";

export function useScrollToTopOnChange(deps: DependencyList) {
  useEffect(() => {
    resetAppScroll();
  }, deps);
}