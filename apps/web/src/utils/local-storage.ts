export const registerTokens = (tokens: { access: string; refresh: string }) => {
  if (typeof window === "undefined") {
    throw new Error("Cannot register tokens on server");
  }
  localStorage.setItem("access-token", tokens.access);
  localStorage.setItem("refresh-token", tokens.refresh);
};

export const clearTokens = () => {
  if (typeof window === "undefined") {
    throw new Error("Cannot clear tokens on server");
  }
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
};

export const getTokens = () => {
  return {
    access:
      typeof window !== "undefined"
        ? localStorage.getItem("access-token")
        : null,
    refresh:
      typeof window !== "undefined"
        ? localStorage.getItem("refresh-token")
        : null,
  };
};
