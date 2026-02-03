import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
  roles?: string[];
};

export default function ProtectedRoute({ children, roles }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(role!)) {
    return <Navigate to="/books" replace />;
  }

  return children;
}
