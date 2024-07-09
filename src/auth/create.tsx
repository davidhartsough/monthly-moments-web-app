import { useState } from "react";
import Spinner from "../components/spinner";
import { State } from "./state";
import { Profile, createNewProfile, isUsernameTaken } from "../db/profiles";

type AuthData = {
  uid: string;
  email: string;
  displayName: string;
};
type Props = {
  authData: AuthData;
  proceed: (profile: State) => void;
};

function getSuggestion({ email, displayName }: AuthData) {
  return displayName.length > 0
    ? displayName.toLowerCase().replace(/[^\p{L}]/gu, "")
    : email.split("@")[0];
}

const usernamePattern = /^[a-z0-9]+$/;
function isValidUsername(id: string) {
  return id.length > 1 && usernamePattern.test(id) && id.length <= 96;
}
const namePattern = /^[\p{L}\p{N}\p{P} ]+$/u;
function isValidName(name: string) {
  return name.length > 1 && namePattern.test(name) && name.length <= 96;
}

function getSearchTerms(username: string, name: string) {
  const searchTerms = [
    name.toUpperCase(),
    username.toUpperCase(),
    ...name.split(" ").map((n) => n.toUpperCase()),
  ];
  return [...new Set(searchTerms)];
}

export default function Create({ authData, proceed }: Props) {
  const [loading, setLoading] = useState(false);
  const [taken, setTaken] = useState<string | null>(null);
  const [name, setName] = useState(authData.displayName);
  const [username, setUsername] = useState(getSuggestion(authData));
  const tryToSave = () => {
    if (!isValidName(name.trim())) {
      (document.getElementById("name") as HTMLInputElement).focus();
      return;
    }
    const id = username.toLowerCase().trim();
    if (!isValidUsername(id)) {
      (document.getElementById("username") as HTMLInputElement).focus();
      return;
    }
    setLoading(true);
    isUsernameTaken(id)
      .then((isTaken) => {
        if (isTaken) {
          setTaken(id);
          setLoading(false);
          return;
        } else {
          const { uid } = authData;
          const p: Profile = {
            uid,
            name: name.trim(),
            username: id,
            searchTerms: getSearchTerms(id, name),
            connections: [],
            ignored: [],
            requested: [],
            requests: [],
          };
          createNewProfile(p)
            .then(() => {
              proceed({
                uid,
                username: p.username,
                name: p.name,
                data: {
                  searchTerms: p.searchTerms,
                  connections: [],
                  ignored: [],
                  requested: [],
                  requests: [],
                },
              });
            })
            .catch(console.warn);
        }
      })
      .catch(console.warn);
  };
  const nameIsValid = isValidName(name);
  const usernameIsValid = isValidUsername(username);
  return (
    <main className="contain">
      <header>
        <h1>Monthly Moments</h1>
        <h2>Create your profile</h2>
      </header>
      <section>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            tryToSave();
            return false;
          }}
        >
          <fieldset disabled={loading}>
            <label htmlFor="name" className="flex">
              <span className="flex-fill">Name</span>
              <span className={`helper${nameIsValid ? " valid" : ""}`}>
                {`${name.length}/96`}
              </span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your Name"
              maxLength={96}
              autoComplete="name"
              autoFocus
              minLength={2}
              required
              title="Enter a valid name"
              pattern="^[\p{L}\p{N}\p{P} ]+$"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
            <div className="separator">
              <div className="line"></div>
            </div>
            <label htmlFor="username" className="flex">
              <span className="flex-fill">Username</span>
              <span className={`helper${usernameIsValid ? " valid" : ""}`}>
                {`${username.length}/96`}
              </span>
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="your-username"
              maxLength={96}
              autoComplete="username"
              spellCheck={false}
              minLength={2}
              required
              title="Enter a valid username"
              pattern="^[a-z0-9]+$"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            {username.length > 1 && !usernameIsValid && (
              <p className="helper error">
                Please only use lowercase letters and numbers.
              </p>
            )}
            {!!taken && (
              <p className="helper error">{`Sorry, the username "${taken}" is taken.`}</p>
            )}
            <p className="helper">
              <strong>NOTE:</strong> Once you choose a username, you cannot
              change it.
            </p>
            <div className="flex-center center">
              {loading ? (
                <Spinner size={2.25} mv />
              ) : (
                <button
                  type="submit"
                  className="btn primary big-btn"
                  disabled={!nameIsValid || !usernameIsValid}
                >
                  Create
                </button>
              )}
            </div>
          </fieldset>
        </form>
      </section>
    </main>
  );
}
