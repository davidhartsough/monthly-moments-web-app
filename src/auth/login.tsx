import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../db/fire";
import { useState } from "react";

const provider = new GoogleAuthProvider();
const signInWithGoogle = () => signInWithPopup(auth, provider);

export default function Login() {
  const [loading, setLoading] = useState(false);
  const signIn = () => {
    setLoading(true);
    signInWithGoogle().catch(console.warn);
  };
  return (
    <main>
      <header>
        <h1>Monthly Moments</h1>
      </header>
      <section>
        <h3>Sign In</h3>
        {loading ? (
          <div className="spinner" />
        ) : (
          <button onClick={signIn}>Sign in with Google</button>
        )}
      </section>
      <article>
        <h2>Introduction</h2>
        <div id="intro">
          <p>
            <strong>Welcome!</strong> This app is a minimal yet meaningful
            social platform for you and your friends to share amazing moments
            with each other — one month at a time.
          </p>
          <p>
            <strong>How Monthly Moments works</strong>
          </p>
          <p>
            It&apos;s like a monthly newsletter; everyone writes about Moments
            from their lives throughout each month, and then at the beginning of
            the next month, all of those Moments are shared out to their
            friends.
          </p>
          <p>
            <strong>Examples of Moments</strong>
          </p>
          <p>
            Generally, Moments capture the the parts of your life that you want
            to share with your friends, including:
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
              className="button"
              href="https://davidhartsough.com/writings/monthly-moments/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </footer>
        </div>
      </article>
    </main>
  );
}
