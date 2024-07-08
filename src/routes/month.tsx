import { Suspense } from "react";
import { Await, useLoaderData, useParams } from "react-router-dom";
import Spinner from "../components/spinner";
import MomentText from "../components/momenttext";
import MonthPicker from "../components/monthpicker";

type Moment = {
  id: string;
  text: string;
};

export default function Month() {
  const data = useLoaderData() as { moments: Moment[] };
  const { id, month } = useParams();
  return (
    <section>
      <MonthPicker id={id!} month={month!} />
      <Suspense fallback={<Spinner />}>
        <Await resolve={data.moments}>
          {(moments: Moment[]) =>
            moments.length > 0 ? (
              <ul className="moments">
                {moments.map(({ id, text }) => (
                  <li key={id} className="moment">
                    <MomentText text={text} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="center">No moments for this month</p>
            )
          }
        </Await>
      </Suspense>
    </section>
  );
}
