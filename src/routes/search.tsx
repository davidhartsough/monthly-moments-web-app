import { useEffect, useState } from "react";
import { Form, Link, useLoaderData, useNavigation } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { acceptFriendRequest, sendFriendRequest, Peep } from "../db/profiles";
import Spinner from "../components/spinner";

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
      <Link to={`/p/${id}`} className="person flex">
        <div className="flex-fill">
          <p className="name">{name}</p>
          <p className="username">{id}</p>
        </div>
        <div className="flex-center ht2">
          <p className="faded">
            <span className="blue">&#10003;</span> Connected
          </p>
        </div>
      </Link>
    );
  }
  return (
    <div className="person flex">
      <div className="flex-fill">
        <p className="name">{name}</p>
        <p className="username">{id}</p>
      </div>
      <div className="btns">
        {loading ? (
          <Spinner size={2} />
        ) : (
          <>
            {status === "sent-req" ? (
              <p className="faded">Requested</p>
            ) : (
              <button onClick={connect} className="btn primary">
                Connect
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Search() {
  const { people, q } = useLoaderData() as { people: Peep[]; q: string };
  const { location } = useNavigation();
  useEffect(() => {
    (document.getElementById("q") as HTMLInputElement).value = q;
  }, [q]);
  useEffect(() => {
    document.title = "Find Your Friends | Monthly Moments";
  }, []);
  const searching = location && new URLSearchParams(location.search).has("q");
  return (
    <main>
      <header>
        <h1>Find Friends</h1>
      </header>
      <Form role="search" className="search-form">
        <fieldset disabled={searching} className="flex">
          <label htmlFor="q" className="search-box flex-fill">
            <SearchIcon size={20} className="search-icon" />
            <input
              type="search"
              name="q"
              id="q"
              placeholder="Search for your friends"
              minLength={2}
              required
              defaultValue={q}
            />
          </label>
          <button type="submit" className="btn" disabled={searching}>
            Search
          </button>
        </fieldset>
      </Form>
      <section className={searching ? "loading" : ""}>
        {people.length > 0 ? (
          <ul className="people">
            {people.map((p) => (
              <li key={p.id}>
                <Person p={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="center">
            {q && q.length > 0 && <p>{`No one found for "${q}"`}</p>}
          </div>
        )}
        {searching && <Spinner />}
      </section>
    </main>
  );
}
