import { CirclePlus, CircleUserRound, House } from "lucide-react";
import { NavLink, Navigate, Outlet, useNavigation } from "react-router-dom";
import { useAuth } from "../auth/context";

export default function Root() {
  const { state } = useNavigation();
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <main>
        <div className="spinner" />
      </main>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <nav>
        <NavLink to="/">
          <House size={48} />
        </NavLink>
        <NavLink to="/add">
          <CirclePlus size={48} />
        </NavLink>
        <NavLink to="/me">
          <CircleUserRound size={48} />
        </NavLink>
      </nav>
      <div id="app" className={state === "loading" ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}
