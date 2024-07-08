import { useState, type ReactNode } from "react";
import { Navigate, useLoaderData } from "react-router-dom";
import Spinner from "../components/spinner";
import { acceptFriendRequest, sendFriendRequest } from "../db/profiles";
import { lastMonth } from "../date-utils";

type Status = "open" | "sent-req" | "have-req" | "ignored" | "connected";

function Section({ children }: { children: ReactNode }) {
  return <section className="center flex-center">{children}</section>;
}

export default function Person() {
  const data = useLoaderData() as { id: string; status: Status };
  const [status, setStatus] = useState(data.status);
  const [loading, setLoading] = useState(false);
  const connect = () => {
    setLoading(true);
    sendFriendRequest(data.id)
      .then(() => {
        setStatus("sent-req");
        setLoading(false);
      })
      .catch(console.warn);
  };
  const accept = () => {
    setLoading(true);
    acceptFriendRequest(data.id)
      .then(() => {
        setStatus("connected");
        setLoading(false);
      })
      .catch(console.warn);
  };
  if (loading) {
    return (
      <Section>
        <Spinner size={2.25} mv />
      </Section>
    );
  }
  switch (status) {
    case "sent-req":
      return (
        <Section>
          <p>Your friend request is pending</p>
        </Section>
      );
    case "open":
      return (
        <Section>
          <button onClick={connect} className="btn primary big-btn">
            Connect
          </button>
        </Section>
      );
    case "ignored":
      return (
        <Section>
          <p>You have ignored this friend request</p>
        </Section>
      );
    case "have-req":
      return (
        <Section>
          <button onClick={accept} className="btn primary big-btn">
            Connect
          </button>
        </Section>
      );
    case "connected":
      return <Navigate to={`/p/${data.id}/${lastMonth}`} />;
    default:
      return (
        <Section>
          <Spinner size={2.25} mv />
        </Section>
      );
  }
}
