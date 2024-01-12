import React, { createContext, useContext } from "react";
import { trpc, type RouterOutput } from "@/utils/trpc";
import { registerTokens, clearTokens, getTokens } from "./local-storage";

export const UserContext = createContext<{
  user?: RouterOutput["auth"]["getMe"];
  isLoading: boolean;
}>({
  user: undefined,
  isLoading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = trpc.auth.getMe.useQuery();
  return (
    <UserContext.Provider value={{ user: data, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

const useUser = () => useContext(UserContext);
type AsyncOrSyncCallback<P extends unknown[] = []> = (
  ...params: P
) => Promise<void> | void;

interface UseAuthParams {
  onLoginSuccess?: AsyncOrSyncCallback<[RouterOutput["auth"]["login"]]>;
  onLoginError?: AsyncOrSyncCallback<[unknown]>;
  onLogoutSuccess?: AsyncOrSyncCallback;
  onLogoutError?: AsyncOrSyncCallback<[unknown]>;
}

export const useAuth = ({
  onLoginSuccess,
  onLoginError,
  onLogoutSuccess,
  onLogoutError,
}: UseAuthParams = {}) => {
  const { user, isLoading } = useUser();
  const tokens = getTokens();
  const utils = trpc.useUtils();
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      registerTokens({
        access: data.tokens.access.token,
        refresh: data.tokens.refresh.token,
      });
      await utils.invalidate();
      return onLoginSuccess?.(data);
    },
    onError: async (e) => {
      await utils.invalidate();
      return onLoginError?.(e);
    },
  });
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      clearTokens();
      await utils.invalidate();
      return onLogoutSuccess?.();
    },
    onError: async (e) => {
      await utils.invalidate();
      return onLogoutError?.(e);
    },
  });
  const login = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };
  const logout = () => {
    if (!tokens.refresh) {
      return;
    }
    logoutMutation.mutate({
      refreshToken: tokens.refresh,
    });
  };
  return { user, login, logout, isLoading };
};
