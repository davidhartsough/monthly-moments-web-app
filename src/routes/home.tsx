import { Suspense, useState } from "react";
import { Await, Link, useLoaderData } from "react-router-dom";
import { Search } from "lucide-react";
import { lastMonthName } from "../date-utils";
import Spinner from "../components/spinner";

type Friend = {
  id: string;
  name: string;
};

function List({ friends }: { friends: Friend[] }) {
  return (
    <ul className="people">
      {friends.map(({ id, name }) => (
        <li key={id}>
          <Link to={`/p/${id}`} className="person">
            <p className="name">{name}</p>
            <p className="username">{id}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Filter({ friends }: { friends: Friend[] }) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();
  const filtered =
    q.length > 0
      ? friends.filter(({ id, name }) =>
          `${id} ${name}`.toLowerCase().includes(q)
        )
      : friends;
  return (
    <>
      <label htmlFor="search" className="search-box">
        <Search size={20} className="search-icon" />
        <input
          placeholder="Search"
          type="search"
          name="search"
          id="search"
          value={query}
          onChange={({ target }) => setQuery(target.value)}
        />
      </label>
      {filtered.length > 0 ? (
        <List friends={filtered} />
      ) : (
        <p className="center">{`No friends match your search for "${query}"`}</p>
      )}
    </>
  );
}

export default function Home() {
  const data = useLoaderData() as { friends: Friend[] };
  return (
    <main>
      <header>
        <h1>Monthly Moments</h1>
        <h2>{lastMonthName} Recaps</h2>
      </header>
      <section>
        <Suspense fallback={<Spinner />}>
          <Await resolve={data.friends}>
            {(friends: Friend[]) => (
              <>
                {friends.length > 10 ? (
                  <Filter friends={friends} />
                ) : (
                  <List friends={friends} />
                )}
                <footer className="center flex-center">
                  <Link to="/search" className="btn">
                    Add More Friends
                  </Link>
                </footer>
              </>
            )}
          </Await>
        </Suspense>
      </section>
    </main>
  );
}
