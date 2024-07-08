import Spinner from "./spinner";

export default function SplashSpinner() {
  return (
    <div>
      <div className="splash flex-center">
        <Spinner size={9} />
      </div>
      <div className="splash flex-center">
        <div className="splash-logo" />
      </div>
    </div>
  );
}
