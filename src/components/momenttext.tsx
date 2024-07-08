const urlPattern =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;
const urlPrefixes = ["https://", "http://", "www.", "www2."];
function formatLink(url: string) {
  let link = url;
  urlPrefixes.forEach((prefix) => {
    if (link.startsWith(prefix)) {
      link = link.replace(prefix, "");
    }
  });
  if (link.charAt(link.length - 1) === "/") {
    link = link.slice(0, -1);
  }
  if (link.length > 40) {
    link = link.substr(0, 40) + "…";
  }
  return link;
}

const MomentLink = ({ url }: { url: string }) => (
  <a
    className="moment-link"
    href={url}
    target="_blank"
    rel="noopener noreferrer"
  >
    {formatLink(url)}
  </a>
);
const hasALink = (str: string) =>
  str.includes("https://") || str.includes("http://");
const whitespacePattern = /\s/;

function formatText(str: string) {
  const text = [];
  let remaining = str;
  while (hasALink(remaining)) {
    let nextIndex = remaining.indexOf("https://");
    const altUrlIndex = remaining.indexOf("http://");
    if (altUrlIndex !== -1 && (nextIndex > altUrlIndex || nextIndex === -1)) {
      nextIndex = altUrlIndex;
    }
    text.push(remaining.slice(0, nextIndex));
    remaining = remaining.slice(nextIndex);
    const nextSpaceIndex = remaining.search(whitespacePattern);
    if (nextSpaceIndex === -1) {
      if (!urlPattern.test(remaining)) {
        text.push(remaining);
      } else {
        text.push(
          <MomentLink key={`${remaining}-${nextSpaceIndex}`} url={remaining} />
        );
      }
      remaining = "";
      break;
    } else {
      const newUrl = remaining.slice(0, nextSpaceIndex);
      if (!urlPattern.test(newUrl)) {
        text.push(newUrl);
      } else {
        text.push(
          <MomentLink key={`${newUrl}-${nextSpaceIndex}`} url={newUrl} />
        );
      }
      remaining = remaining.slice(nextSpaceIndex);
    }
  }
  if (remaining.length > 0) text.push(remaining);
  return text;
}

export default function MomentText({ text }: { text: string }) {
  return (
    <p className="moment-text">{hasALink(text) ? formatText(text) : text}</p>
  );
}
