import {
  createBrowserRouter,
  defer,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Root from "./root";
import Home from "./home";
import Add from "./add";
import Me from "./me";
import Search from "./search";
import Requests from "./requests";
import Profile from "./profile";
import Person from "./person";
import Month from "./month";
import EditName from "./editname";
import { logout } from "../db/auth";
import {
  getFriendRequests,
  getMyFriends,
  getPeople,
  getProfile,
  updateName,
} from "../db/profiles";
import { getMomentsForMonth, getMyMomentsThisMonth } from "../db/moments";
import { getState } from "../auth/state";
import { isValidMonth, lastMonth } from "../date-utils";
import ErrorMsg from "../components/errormsg";
import { clearStorage } from "../db/store";

const baseTitle = "Monthly Moments";
const setDocTitle = (title: string) => {
  document.title = `${title} | ${baseTitle}`;
};
const resetDocTitle = () => {
  document.title = baseTitle;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorMsg />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: () => {
          const { data } = getState()!;
          if (data.connections.length === 0) {
            return redirect("/search");
          }
          resetDocTitle();
          const friends = getMyFriends();
          return defer({ friends });
        },
      },
      {
        path: "p/:id",
        loader: ({ params }) => {
          const { id } = params;
          if (!id) return redirect("/");
          const profile = getProfile(id);
          return defer({ profile });
        },
        element: <Profile />,
        children: [
          {
            index: true,
            loader: ({ params }) => {
              const { id } = params;
              if (!id) return redirect("/");
              const { username, data } = getState()!;
              if (id === username || data.connections.includes(id)) {
                return redirect(`/p/${id}/${lastMonth}`);
              }
              let status = "open";
              if (data.requested.includes(id)) {
                status = "sent-req";
              }
              if (data.requests.includes(id)) {
                status = "have-req";
              }
              if (data.ignored.includes(id)) {
                status = "ignored";
              }
              return { id, status };
            },
            element: <Person />,
          },
          {
            path: ":month",
            loader: ({ params }) => {
              const { id, month } = params;
              if (!id) return redirect("/");
              if (!month || !isValidMonth(month)) {
                return redirect(`/p/${id}/${lastMonth}`);
              }
              const moments = getMomentsForMonth(id, month);
              return defer({ moments });
            },
            element: <Month />,
          },
        ],
      },
      {
        path: "add",
        loader: () => {
          resetDocTitle();
          const moments = getMyMomentsThisMonth();
          return defer({ moments });
        },
        element: <Add />,
      },
      {
        path: "me",
        loader: () => {
          resetDocTitle();
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
          setDocTitle("Friends Requests");
          const requests = getFriendRequests();
          return defer({ requests });
        },
        element: <Requests />,
      },
      {
        path: "edit-name",
        loader: () => {
          setDocTitle("Edit Name");
          const { name } = getState()!;
          return { name };
        },
        action: async ({ request }) => {
          const formData = await request.formData();
          const newName = formData.get("name");
          const { name } = getState()!;
          if (newName && typeof newName === "string" && newName !== name) {
            await updateName(newName);
          }
          return redirect("/me");
        },
        element: <EditName />,
      },
      {
        path: "sign-out",
        loader: async () => {
          await logout();
          clearStorage();
          return redirect("/");
        },
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
