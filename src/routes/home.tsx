import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

type Friend = {
  id: string;
  name: string;
};

function List({ friends }: { friends: Friend[] }) {
  return (
    <ul>
      {friends.map(({ id, name }) => (
        <li key={id}>
          <Link to={`/p/${id}`}>
            <p>{name}</p>
            <p>{id}</p>
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
    <section>
      <input
        placeholder="Search"
        type="search"
        name="search"
        id="search"
        value={query}
        onChange={({ target }) => setQuery(target.value)}
      />
      {filtered.length > 0 ? (
        <List friends={filtered} />
      ) : (
        <p className="empty">{`No friends match your search for "${query}"`}</p>
      )}
    </section>
  );
}

export default function Home() {
  const { friends } = useLoaderData() as { friends: Friend[] };
  return (
    <main>
      <header>
        <h1>[Month] Recaps</h1>
      </header>
      {friends.length > 10 ? (
        <Filter friends={friends} />
      ) : (
        <section>
          {friends.length > 0 ? (
            <List friends={friends} />
          ) : (
            <p className="empty">
              Looks like you haven&apos;t added any friends yet.
            </p>
          )}
        </section>
      )}
      <footer>
        <Link to="/search">Add More Friends</Link>
      </footer>
    </main>
  );
}
