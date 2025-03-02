import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { ApiClient } from "../api/apiClient.js";

type Claim = {
  type: string;
  value: string;
};

type GlobalAuthContent = {
  loggedInUser: Claim[] | null;
  logoutUrl: string;
  refreshAuth: Function;
  loading: boolean;
  error: string | null;
  userId: number | null;
  userName: string | null;
};

const AuthContext = createContext<GlobalAuthContent>({
  loggedInUser: null,
  logoutUrl: "",
  refreshAuth: () => {},
  loading: true,
  error: null,
  userId: null,
  userName: null,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<Claim[] | null>(null);
  const [logoutUrl, setLogoutUrl] = useState("/bff/logout");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    getUser();
  }, [refresh]);

  const getUser = () => {
    setLoading(true);
    ApiClient.get("/bff/user")
      .then((data) => {
        if (Array.isArray(data)) {
          const logout_url =
            data.find((claim) => claim.type === "bff:logout_url")?.value ??
            logoutUrl;

          setLogoutUrl(logout_url);
          setLoggedInUser(data);

          const sub = Number(data.find((claim) => claim.type === "sub")?.value);
          setUserId(sub);

          const email = data.find((claim) => claim.type === "email")?.value;
          setUserName(email);
        }
      })
      .catch((e) => {
        setLoggedInUser(null);
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refreshAuth = () => setRefresh((prev) => !prev);

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        logoutUrl,
        refreshAuth,
        loading,
        error,
        userId,
        userName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
