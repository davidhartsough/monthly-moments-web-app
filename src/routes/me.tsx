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
              <Link to="/requests" className="btn link-btn">
                Friend Requests
              </Link>
            </li>
          )}
          <li>
            <Link to={`/p/${username}`} className="btn link-btn">
              Your Recaps
            </Link>
          </li>
          <li>
            <Link to="/search" className="btn link-btn">
              Find Friends
            </Link>
          </li>
          <li>
            <Link to="/edit-name" className="btn link-btn">
              Edit Name
            </Link>
          </li>
          <li>
            <Link to="/sign-out" className="btn link-btn">
              Sign Out
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
