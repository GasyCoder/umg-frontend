"use client";

import { useEffect } from "react";
import ReactDOM from "react-dom";

export function ApiPreconnect() {
  useEffect(() => {
    // @ts-ignore - React 18/Next 14+ feature
    if (typeof ReactDOM.preconnect === 'function') {
        // @ts-ignore
        ReactDOM.preconnect('https://api.mahajanga-univ.mg', { crossOrigin: 'anonymous' });
        // @ts-ignore
        ReactDOM.dnsPrefetch('https://api.mahajanga-univ.mg');
    }
  }, []);
  
  return null;
}
