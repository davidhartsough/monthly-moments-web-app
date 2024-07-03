import { Form, useLoaderData } from "react-router-dom";

export default function EditName() {
  const { name } = useLoaderData() as { name: string };
  return (
    <main>
      <header>
        <h1>Edit Your Name</h1>
      </header>
      <section>
        <Form method="post">
          <input
            type="text"
            defaultValue={name}
            placeholder="Your Name"
            autoFocus
            autoComplete="name"
            minLength={2}
            required
          />
          <button type="submit">Save</button>
        </Form>
      </section>
    </main>
  );
}
