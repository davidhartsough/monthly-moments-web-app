import { Link, useLoaderData } from "react-router-dom";

export default function Me() {
  const { username, name, hasRequests } = useLoaderData() as {
    username: string;
    name: string;
    hasRequests: boolean;
  };
  return (
    <main>
      <header>
        <h1>{name}</h1>
        <h2>{username}</h2>
      </header>
      <section>
        <ul>
          {hasRequests && (
            <li>
              <Link to="/requests">Requests</Link>
            </li>
          )}
          <li>
            <Link to="/p/me">My Recaps</Link>
          </li>
          <li>
            <Link to="/search">Find Friends</Link>
          </li>
          <li>
            <Link to="/edit-name">Edit Name</Link>
          </li>
          <li>
            <Link to="/sign-out">Sign Out</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
