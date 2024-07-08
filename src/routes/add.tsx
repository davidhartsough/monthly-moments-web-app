import { Suspense, useState } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { Edit } from "lucide-react";
import { createMoment, deleteMoment, updateMoment } from "../db/moments";
import { thisMonthName } from "../date-utils";
import MomentText from "../components/momenttext";
import Spinner from "../components/spinner";

type Moment = {
  id: string;
  text: string;
};

function MomentItem({ moment }: { moment: Moment }) {
  const [momentText, setMomentText] = useState(moment.text);
  const [isEditing, setIsEditing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const editMoment = () => {
    setIsBusy(true);
    updateMoment(moment.id, momentText)
      .then(() => {
        setIsBusy(false);
        setIsEditing(false);
      })
      .catch(console.warn);
  };
  const onCancel = () => {
    setMomentText(moment.text);
    setIsEditing(false);
  };
  const onDelete = () => {
    setIsBusy(true);
    deleteMoment(moment.id)
      .then(() => setIsDeleted(true))
      .catch(console.warn);
  };
  if (isDeleted) return null;
  return (
    <div className="editable-moment">
      {isEditing ? (
        <form
          className="moment-form"
          onSubmit={(e) => {
            e.preventDefault();
            editMoment();
            return false;
          }}
        >
          <fieldset disabled={isBusy}>
            <textarea
              name="moment"
              placeholder="Share a moment from this month"
              minLength={2}
              maxLength={528}
              rows={4}
              autoFocus
              required
              value={momentText}
              onChange={({ target }) => setMomentText(target.value)}
              readOnly={isBusy}
            ></textarea>
            <div className="btns">
              {isBusy ? (
                <Spinner size={2} />
              ) : (
                <>
                  <button type="button" className="btn" onClick={onCancel}>
                    Cancel
                  </button>
                  {momentText.trim().length > 0 ? (
                    <button
                      type="submit"
                      className="btn primary"
                      disabled={
                        momentText.trim().length < 3 ||
                        momentText.length > 528 ||
                        isBusy
                      }
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn delete"
                      onClick={onDelete}
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </fieldset>
        </form>
      ) : (
        <>
          <div className="moment">
            <MomentText text={momentText} />
          </div>
          <button
            type="button"
            className="toggle-edit flex-center"
            onClick={() => setIsEditing(true)}
          >
            <Edit size={16} />
          </button>
        </>
      )}
    </div>
  );
}

export default function Add() {
  const data = useLoaderData() as { moments: Moment[] };
  const [newMoments, setNewMoments] = useState<Moment[]>([]);
  const [momentText, setMomentText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const saveNewMoment = () => {
    setIsAdding(true);
    const text = momentText.trim();
    createMoment(text)
      .then((id) => {
        setMomentText("");
        setIsAdding(false);
        setNewMoments((prev) => [...prev, { id, text }]);
      })
      .catch(console.warn);
  };
  return (
    <main>
      <header>
        <h1>Your moments this month</h1>
        <h2>{thisMonthName}</h2>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveNewMoment();
          return false;
        }}
        className="mb3"
      >
        <fieldset disabled={isAdding}>
          <textarea
            name="moment"
            placeholder="Share a moment from this month"
            minLength={2}
            maxLength={528}
            rows={4}
            autoFocus
            required
            value={momentText}
            onChange={({ target }) => setMomentText(target.value)}
            readOnly={isAdding}
          ></textarea>
          <div className="flex-center">
            {isAdding ? (
              <Spinner size={2.25} mv />
            ) : (
              <button type="submit" className="btn primary big-btn">
                Add
              </button>
            )}
          </div>
        </fieldset>
      </form>
      <section>
        <ul className="moments">
          <Suspense fallback={<Spinner />}>
            <Await resolve={data.moments}>
              {(moments: Moment[]) =>
                moments.map((m) => (
                  <li key={m.id}>
                    <MomentItem moment={m} />
                  </li>
                ))
              }
            </Await>
          </Suspense>
          {newMoments.map((m) => (
            <li key={m.id}>
              <MomentItem moment={m} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
