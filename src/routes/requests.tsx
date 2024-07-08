import { Suspense, useState } from "react";
import { Await, Link, useLoaderData } from "react-router-dom";
import { acceptFriendRequest, ignoreFriendRequest } from "../db/profiles";
import Spinner from "../components/spinner";
import { addFriend } from "../auth/state";

type FriendRequest = {
  id: string;
  name: string;
};

type Status = "open" | "connected" | "ignored";

function Person({ id, name }: { id: string; name: string }) {
  const [status, setStatus] = useState<Status>("open");
  const [loading, setLoading] = useState(false);
  const connect = () => {
    setLoading(true);
    acceptFriendRequest(id)
      .then(() => {
        addFriend({ id, name });
        setStatus("connected");
        setLoading(false);
      })
      .catch(console.warn);
  };
  const ignore = () => {
    setLoading(true);
    ignoreFriendRequest(id)
      .then(() => {
        setStatus("ignored");
        setLoading(false);
      })
      .catch(console.warn);
  };
  if (status === "connected") {
    return (
      <Link to={`/p/${id}`} className="flex">
        <div className="flex-fill">
          <p className="name">{name}</p>
          <p className="username">{id}</p>
        </div>
        <div className="flex-center">
          <p className="faded">
            <span className="blue">&#10003;</span> Connected
          </p>
        </div>
      </Link>
    );
  }
  return (
    <div className="flex">
      <div className="flex-fill">
        <p className="name">{name}</p>
        <p className="username">{id}</p>
      </div>
      <div className="btns">
        {loading ? (
          <Spinner size={1.25} />
        ) : (
          <>
            {status === "ignored" ? (
              <p className="faded">Ignored</p>
            ) : (
              <>
                <button onClick={connect} className="btn primary">
                  Accept
                </button>
                <button onClick={ignore} className="btn">
                  Ignore
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

type LoaderData = { requests: FriendRequest[] };

export default function Requests() {
  const data = useLoaderData() as LoaderData;
  return (
    <main>
      <header>
        <h1>Friend Requests</h1>
      </header>
      <section>
        <Suspense fallback={<Spinner />}>
          <Await resolve={data.requests}>
            {(requests: FriendRequest[]) =>
              requests.length > 0 ? (
                <ul className="people">
                  {requests.map(({ id, name }) => (
                    <li key={id} className="person">
                      <Person id={id} name={name} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="center">
                  Looks like you don&apos;t have any friend requests at the
                  moment.
                </p>
              )
            }
          </Await>
        </Suspense>
      </section>
    </main>
  );
}
