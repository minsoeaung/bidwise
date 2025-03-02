import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  id: number;
  userName: string;
  children: ReactNode | string;
};

export const UserLink = ({ id, userName, children }: Props) => {
  const { userId } = useAuth();

  if (!!userId && userId === id) {
    return <Link to="/account/listings">{children}</Link>;
  }

  return <Link to={`/users/${id}?UserName=${userName}`}>{children}</Link>;
};
