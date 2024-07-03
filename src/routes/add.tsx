import { Edit } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import "./add.css";
import { createMoment, deleteMoment, updateMoment } from "../db/moments";

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
              rows={8}
              autoFocus
              required
              value={momentText}
              onChange={({ target }) => setMomentText(target.value)}
            ></textarea>
            <button
              type="button"
              onClick={({ currentTarget }) => {
                currentTarget.form?.reset();
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
            {momentText.trim().length > 0 ? (
              <button
                type="submit"
                disabled={
                  momentText.trim().length < 3 ||
                  momentText.length > 528 ||
                  isBusy
                }
              >
                Save
              </button>
            ) : (
              <button type="button" onClick={onDelete}>
                Delete
              </button>
            )}
            {isBusy && <div className="spinner" />}
          </fieldset>
        </form>
      ) : (
        <div className="moment">
          <p>{momentText}</p>
          <button
            type="button"
            className="toggle-edit"
            onClick={() => setIsEditing(true)}
          >
            <Edit size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Add() {
  const data = useLoaderData() as { moments: Moment[] };
  const [moments, setMoments] = useState(data.moments);
  const [momentText, setMomentText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const currentMonth = "2024-07";
  const thisMonthFormatted = "July 2024";
  const saveNewMoment = () => {
    setIsAdding(true);
    const text = momentText.trim();
    createMoment(currentMonth, text)
      .then((id) => {
        setMomentText("");
        setIsAdding(false);
        setMoments((prev) => [...prev, { id, text }]);
      })
      .catch(console.warn);
  };
  return (
    <main>
      <header>
        <h1>Your moments this month</h1>
        <h2>{thisMonthFormatted}</h2>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveNewMoment();
          return false;
        }}
      >
        <fieldset disabled={isAdding}>
          <textarea
            name="moment"
            placeholder="Share a moment from this month"
            minLength={2}
            maxLength={528}
            rows={8}
            autoFocus
            required
            value={momentText}
            onChange={({ target }) => setMomentText(target.value)}
            readOnly={isAdding}
          ></textarea>
          <button type="submit" disabled={isAdding}>
            {isAdding ? "Adding..." : "Add"}
          </button>
          {isAdding && <div className="spinner" />}
        </fieldset>
      </form>
      <section>
        <ul className="moments-list">
          {moments.map((m) => (
            <li key={m.id}>
              <MomentItem moment={m} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
