export default function Spinner({
  size = 3,
  mv = false,
}: {
  size?: number;
  mv?: boolean;
}) {
  return (
    <div
      className={`spinner${mv ? " mv1" : ""}`}
      style={{ width: `${size}rem`, height: `${size}rem` }}
    />
  );
}
