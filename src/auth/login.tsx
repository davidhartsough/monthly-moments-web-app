import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Spinner from "../components/spinner";
import { auth } from "../db/fire";

const provider = new GoogleAuthProvider();
const signInWithGoogle = () => signInWithPopup(auth, provider);

export default function Login() {
  const [loading, setLoading] = useState(false);
  const signIn = () => {
    setLoading(true);
    signInWithGoogle().catch(console.warn);
  };
  return (
    <main className="contain">
      <header className="center">
        <h1>Monthly Moments</h1>
      </header>
      <section className="flex-center center">
        <div className="login">
          <p className="login-label">Sign In:</p>
          <div className="login-action flex-center">
            {loading ? (
              <Spinner size={2} />
            ) : (
              <button onClick={signIn} className="btn btn-w-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="btn-icon"
                >
                  <g>
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </g>
                </svg>
                <span className="btn-text">Continue with Google</span>
              </button>
            )}
          </div>
        </div>
      </section>
      <article>
        <p>
          <strong>Welcome!</strong> This app is a minimal yet meaningful social
          platform for you and your friends to share amazing moments with each
          other — one month at a time.
        </p>
        <p>
          <strong>How Monthly Moments works</strong>
        </p>
        <p>
          It&apos;s like a monthly newsletter; everyone writes about Moments
          from their lives throughout each month, and then at the beginning of
          the next month, all of those Moments are shared out to their friends.
        </p>
        <p>
          <strong>Examples of Moments</strong>
        </p>
        <p>
          Generally, Moments capture the the parts of your life that you want to
          share with your friends, including:
        </p>
        <ul>
          <li>Major life events and milestones</li>
          <li>Events you went to or were a part of</li>
          <li>Happenings, life updates, changes</li>
          <li>Projects, accomplishments, achievements</li>
          <li>
            Activities and things you enjoyed, spent time with, or found
            meaningful
          </li>
          <li>Media, entertainment, games, movies, books</li>
        </ul>
        <footer>
          <a
            className="btn"
            href="https://davidhartsough.com/writings/monthly-moments/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </footer>
      </article>
    </main>
  );
}
