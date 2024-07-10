import Login from "./login";

export default function Landing() {
  return (
    <main className="contain">
      <header className="center">
        <h1>Monthly Moments</h1>
      </header>
      <Login />
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
