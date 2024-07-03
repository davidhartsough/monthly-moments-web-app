import { createBrowserRouter, defer, redirect } from "react-router-dom";
import Root from "./root";
import Home from "./home";
import Add from "./add";
import Me from "./me";
import Search from "./search";
import Requests from "./requests";
import Profile from "./profile";
import Month from "./month";
import EditName from "./editname";
import Login from "./login";
import { logout, signInWithGoogle, getCurrentUser } from "../db/auth";
import {
  getFriendRequests,
  getMyFriends,
  getPeople,
  getProfile,
} from "../db/profiles";
import { getMomentsForMonth, getMyMomentsThisMonth } from "../db/moments";
import { getState } from "../auth/state";

const router = createBrowserRouter([
  {
    path: "/login",
    loader: () => {
      const user = getCurrentUser();
      if (user) return redirect("/");
      return true;
    },
    action: async () => {
      await signInWithGoogle();
      return redirect("/");
    },
    element: <Login />,
  },
  {
    path: "/create",
    loader: () => {
      const state = getState();
      if (state && state.username.length > 0 && state.name.length > 0) {
        return redirect("/");
      }
      return true;
    },
    // action: () => {},
    // element:
  },
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <main>
        <h3>Yikes, there was an error.</h3>
      </main>
    ),
    children: [
      {
        index: true,
        element: <Home />,
        loader: async () => {
          const friends = await getMyFriends();
          if (friends.length === 0) return redirect("/search");
          return { friends };
        },
      },
      {
        path: "p/:id",
        element: <Profile />,
        loader: async ({ params }) => {
          const { id } = params;
          if (!id) return redirect("/");
          const profile = await getProfile(id);
          if (!profile) {
            throw new Error("No profile matches this username");
          }
          return profile;
        },
        errorElement: (
          <main>
            <h3>Sorry, no profile matches this username.</h3>
          </main>
        ),
        children: [
          {
            index: true,
            loader: () => {
              // TODO: get last month
              const lastMonth = "2024-06";
              return redirect(`./${lastMonth}`);
            },
            element: (
              <section>
                <div className="spinner" />
              </section>
            ),
          },
          {
            path: ":month",
            loader: ({ params }) => {
              const { id, month } = params;
              // TODO: verify month is OK
              const moments = getMomentsForMonth(id!, month!);
              return defer({ moments });
            },
            element: <Month />,
          },
        ],
      },
      {
        path: "add",
        loader: async () => {
          const moments = await getMyMomentsThisMonth();
          return { moments };
        },
        element: <Add />,
      },
      {
        path: "me",
        loader: () => {
          const { username, name, data } = getState()!;
          const hasRequests = data.requests.length > 0;
          return { username, name, hasRequests };
        },
        element: <Me />,
      },
      {
        path: "search",
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const q = url.searchParams.get("q");
          const people = q ? await getPeople(q) : [];
          return { people, q };
        },
        element: <Search />,
      },
      {
        path: "requests",
        loader: () => {
          const requests = getFriendRequests();
          return defer({ requests });
        },
        element: <Requests />,
      },
      {
        path: "edit-name",
        loader: () => {
          const { name } = getState()!;
          return { name };
        },
        action: async ({ request }) => {
          const formData = await request.formData();
          const data = Object.fromEntries(formData);
          console.log(data);
          return redirect("/me");
        },
        element: <EditName />,
      },
      {
        path: "sign-out",
        loader: async () => {
          await logout();
          return redirect("/");
        },
      },
    ],
  },
]);

export default router;
