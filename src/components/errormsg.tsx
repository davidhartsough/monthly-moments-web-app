import { useRouteError } from "react-router-dom";

type Err = string | { message: string };

export default function ErrorMsg() {
  const err = useRouteError() as Err;
  const msg = typeof err === "string" ? err : err.message;
  return (
    <main className="center">
      <h3>{msg}</h3>
    </main>
  );
}
