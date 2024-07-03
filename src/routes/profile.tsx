import { Outlet, useLoaderData } from "react-router-dom";

type LoaderData = {
  id: string;
  name: string;
};

export default function Profile() {
  const { id, name } = useLoaderData() as LoaderData;
  return (
    <main>
      <header>
        <h1>{name}</h1>
        <h2>{id}</h2>
      </header>
      <Outlet />
    </main>
  );
}
