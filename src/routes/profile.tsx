import { Suspense, useEffect } from "react";
import { Await, Outlet, useLoaderData, useParams } from "react-router-dom";
import SplashSpinner from "../components/splashspinner";

type PersonProfile = {
  id: string;
  name: string;
};

function Header({ id, name }: PersonProfile) {
  useEffect(() => {
    document.title = `${name} | Monthly Moments`;
  }, [name]);
  return (
    <header>
      <h1>{name}</h1>
      <h2>{id}</h2>
    </header>
  );
}

function NotFound() {
  const { id } = useParams();
  return (
    <div className="center">
      <h3>{`No profile matches the username: "${id}"`}</h3>
    </div>
  );
}

export default function Profile() {
  const data = useLoaderData() as { profile: PersonProfile | null };
  return (
    <main>
      <Suspense fallback={<SplashSpinner />}>
        <Await resolve={data.profile}>
          {(profile: PersonProfile | null) =>
            profile ? (
              <>
                <Header {...profile} />
                <Outlet />
              </>
            ) : (
              <NotFound />
            )
          }
        </Await>
      </Suspense>
    </main>
  );
}
