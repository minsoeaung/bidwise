import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
};

const AuthContext = createContext<GlobalAuthContent>({
  loggedInUser: null,
  logoutUrl: "",
  refreshAuth: () => {},
  loading: true,
  error: null,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<Claim[] | null>(null);
  const [logoutUrl, setLogoutUrl] = useState("/bff/logout");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

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
      value={{ loggedInUser, logoutUrl, refreshAuth, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
