import { Form, useNavigation } from "react-router-dom";
import { lastMonthName } from "../date-utils";
import Spinner from "../components/spinner";

export default function SuperSecretSaver() {
  const { state } = useNavigation();
  const isLoading = state === "loading" || state === "submitting";
  return (
    <main>
      <header>
        <h1>Bad! Naughty! You missed it!</h1>
        <h2>{lastMonthName}</h2>
      </header>
      <section>
        <p>
          Alright, here&apos;s how this is gonna work: <br />
          You get this one last chance to put all your moments down for the last
          month in one big text field. Once you hit save, that&apos;s it.
        </p>
        <p>
          <strong>
            Separate each moment apart with at least 2 empty lines.
          </strong>
        </p>
      </section>
      <Form method="post" className="mb3">
        <fieldset disabled={isLoading}>
          <textarea
            name="moments"
            placeholder="Enter all of your moments from the previous month and separate each one with at least 2 empty lines."
            minLength={2}
            maxLength={10000}
            rows={40}
            autoFocus
            required
          ></textarea>
          <div className="flex-center">
            {isLoading ? (
              <Spinner size={2.25} mv />
            ) : (
              <button type="submit" className="btn primary big-btn">
                Save
              </button>
            )}
          </div>
        </fieldset>
      </Form>
    </main>
  );
}
