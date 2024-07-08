import { lazy, Suspense } from "react";
import SplashSpinner from "../components/splashspinner";

const Router = lazy(() => import("./router"));

export default function LazyRouter() {
  return (
    <Suspense fallback={<SplashSpinner />}>
      <Router />
    </Suspense>
  );
}
