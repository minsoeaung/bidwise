import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const AuthContext = createContext({
    loggedInUser: null,
    setLoggedInUser: () => { },
});

export const AuthContextProvider = ({ children }) => {
    const [logoutUrl, setLogoutUrl] = useState("");
    const [loggedInUser, setLoggedInUser] = useLocalStorage("currentUser", null);

    const fetchIsUserLoggedIn = async () => {
        try {
            const response = await fetch("/bff/user", {
                headers: {
                    "X-CSRF": 1,
                },
            });

            if (response.ok && response.status === 200) {
                const data = await response.json();
                const logoutUrl = data.find(
                    (claim) => claim.type === "bff:logout_url"
                )?.value;
                setLogoutUrl(logoutUrl);
                // set user here
            }
        } catch (e) {
            setLoggedInUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ loggedInUser: loggedInUser, setLoggedInUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
