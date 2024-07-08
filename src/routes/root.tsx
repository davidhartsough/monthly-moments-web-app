import { NavLink, Outlet, useNavigation } from "react-router-dom";
import { CalendarPlus, CircleUserRound, House } from "lucide-react";

export default function Root() {
  const { state } = useNavigation();
  return (
    <>
      <nav>
        <div className="nav-links">
          <NavLink to="/">
            <House size={48} />
          </NavLink>
          <NavLink to="/add">
            <CalendarPlus size={48} />
          </NavLink>
          <NavLink to="/me">
            <CircleUserRound size={48} />
          </NavLink>
        </div>
      </nav>
      <div
        id="app"
        className={`contain${state === "loading" ? " loading" : ""}`}
      >
        <Outlet />
      </div>
    </>
  );
}
