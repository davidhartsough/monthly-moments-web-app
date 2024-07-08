import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthOptions } from "../date-utils";

export default function MonthPicker({
  month,
  id,
}: {
  month: string;
  id: string;
}) {
  const navigate = useNavigate();
  const goToMonth = (m: string) => navigate(`/p/${id}/${m}`);
  const monthIndex = monthOptions.findIndex((m) => m.value === month);
  const prevMonth =
    monthIndex !== monthOptions.length - 1
      ? monthOptions[monthIndex + 1].value
      : null;
  const nextMonth =
    monthIndex !== 0 ? monthOptions[monthIndex - 1].value : null;
  return (
    <div className="month-picker">
      {prevMonth ? (
        <Link to={`/p/${id}/${prevMonth}`} className="month-nav">
          <ChevronLeft />
        </Link>
      ) : (
        <div className="month-nav disabled">
          <ChevronLeft />
        </div>
      )}
      <div className="picker">
        <select
          value={month}
          onChange={({ target }) => {
            goToMonth(target.value);
          }}
        >
          {monthOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {nextMonth ? (
        <Link to={`/p/${id}/${nextMonth}`} className="month-nav">
          <ChevronRight />
        </Link>
      ) : (
        <div className="month-nav disabled">
          <ChevronRight />
        </div>
      )}
    </div>
  );
}
