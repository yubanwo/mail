import { useCallback, useState } from "react";

const TOKEN_KEY = "mail_console_tokens";

export function useStoredTokens() {
  const [tokens, setTokensState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(TOKEN_KEY));
    } catch {
      return null;
    }
  });

  const setTokens = useCallback((nextTokens) => {
    setTokensState(nextTokens);

    if (nextTokens) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(nextTokens));
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  return [tokens, setTokens];
}
