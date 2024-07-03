import { Suspense } from "react";
import { Await, useLoaderData, useParams } from "react-router-dom";

type Moment = {
  id: string;
  text: string;
};

export default function Month() {
  const data = useLoaderData() as { moments: Moment[] };
  const { month } = useParams();
  return (
    <section>
      <Suspense fallback={<div className="spinner" />}>
        <Await resolve={data.moments}>
          {(moments: Moment[]) => (
            <>
              <div>
                <p>[month picker]</p>
                <p>{month}</p>
              </div>
              {moments.length > 0 ? (
                <ul>
                  {moments.map(({ id, text }) => (
                    <li key={id}>{text}</li>
                  ))}
                </ul>
              ) : (
                <p>No moments for this month</p>
              )}
            </>
          )}
        </Await>
      </Suspense>
    </section>
  );
}
