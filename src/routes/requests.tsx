import { Await, Link, useLoaderData } from "react-router-dom";
import { acceptFriendRequest, ignoreFriendRequest } from "../db/profiles";
import { Suspense, useState } from "react";

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
            {status === "ignored" ? (
              <p>Ignored</p>
            ) : (
              <>
                <button onClick={connect}>Accept</button>
                <button onClick={ignore}>Ignore</button>
              </>
            )}
          </>
        )}
      </div>
    </>
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
        <Suspense fallback={<div className="spinner" />}>
          <Await resolve={data.requests}>
            {(requests: FriendRequest[]) => (
              <>
                {requests.length > 0 ? (
                  <ul>
                    {requests.map(({ id, name }) => (
                      <li key={id}>
                        <Person id={id} name={name} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No friend requests</p>
                )}
              </>
            )}
          </Await>
        </Suspense>
      </section>
    </main>
  );
}
