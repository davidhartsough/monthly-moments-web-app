import { Form, useLoaderData, useNavigation } from "react-router-dom";
import Spinner from "../components/spinner";

export default function EditName() {
  const { name } = useLoaderData() as { name: string };
  const { state } = useNavigation();
  const isLoading = state === "loading" || state === "submitting";
  return (
    <main>
      <header>
        <h1>Edit Your Name</h1>
      </header>
      <section>
        <Form method="post">
          <fieldset className="flex gap" disabled={isLoading}>
            <input
              type="text"
              defaultValue={name}
              name="name"
              placeholder="Your Name"
              autoFocus
              autoComplete="name"
              minLength={2}
              required
            />
            <div className="flex-center min-width">
              {isLoading ? (
                <Spinner size={2} mv />
              ) : (
                <button type="submit" className="btn primary">
                  Save
                </button>
              )}
            </div>
          </fieldset>
        </Form>
      </section>
    </main>
  );
}
