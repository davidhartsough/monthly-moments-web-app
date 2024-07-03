import { useEffect, useState } from "react";
import { Form, Link, useLoaderData, useNavigation } from "react-router-dom";
import { acceptFriendRequest, sendFriendRequest, Peep } from "../db/profiles";

function Person({ p }: { p: Peep }) {
  const [status, setStatus] = useState(p.status);
  const [loading, setLoading] = useState(false);
  const { id, name } = p;
  const connect = () => {
    setLoading(true);
    if (status === "open") {
      sendFriendRequest(id)
        .then(() => {
          setStatus("sent-req");
          setLoading(false);
        })
        .catch(console.warn);
    } else {
      acceptFriendRequest(id)
        .then(() => {
          setStatus("connected");
          setLoading(false);
        })
        .catch(console.warn);
    }
  };
  if (status === "connected") {
    return (
      <Link to={`/p/${id}`}>
        <div>
          <p>{name}</p>
          <p>{id}</p>
        </div>
        <div>
          <p>Connected</p>
        </div>
      </Link>
    );
  }
  return (
    <>
      <div>
        <p>{name}</p>
        <p>{id}</p>
      </div>
      <div>
        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            {status === "sent-req" ? (
              <p>Requested</p>
            ) : (
              <button onClick={connect}>Connect</button>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function Search() {
  const { people, q } = useLoaderData() as { people: Peep[]; q: string };
  const { location } = useNavigation();
  useEffect(() => {
    (document.getElementById("q") as HTMLInputElement).value = q;
  }, [q]);
  const searching = location && new URLSearchParams(location.search).has("q");
  return (
    <main>
      <header>
        <h1>Find Friends</h1>
      </header>
      <Form role="search">
        <fieldset disabled={searching}>
          <input
            type="search"
            name="q"
            id="q"
            placeholder="Search for your friends"
            minLength={2}
            required
            defaultValue={q}
          />
          <button type="submit" disabled={searching}>
            Search
          </button>
        </fieldset>
      </Form>
      <section className={searching ? "loading" : ""}>
        {people.length > 0 ? (
          <ul>
            {people.map((p) => (
              <li key={p.id}>
                <Person p={p} />
              </li>
            ))}
          </ul>
        ) : (
          <p>{`No one found for "${q}"`}</p>
        )}
        {searching && <div className="spinner" />}
      </section>
    </main>
  );
}
