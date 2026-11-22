import {useAuth} from "../auth/AuthContext.jsx";
import AuthPage from "./AuthPage.jsx";

export default function AuthGate({children}) {
  const {user, loading} = useAuth();

  if (loading) return null;
  if (!user) return <AuthPage/>;

  return children;
}
