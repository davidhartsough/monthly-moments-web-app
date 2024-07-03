import { Form } from "react-router-dom";

export default function Login() {
  return (
    <main>
      <header>
        <h1>Sign In</h1>
      </header>
      <section>
        <Form method="post" replace>
          <button type="submit">Sign in with Google</button>
        </Form>
      </section>
    </main>
  );
}
