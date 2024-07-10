import GoogleSignIn from "./googlesignin";

function isEmbeddedBrowser() {
  const touchEvents = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const windowSizeCheck = window.innerWidth < 600 || window.innerHeight < 600;
  const orientate = "orientation" in window || "onorientationchange" in window;
  const ua = window.navigator.userAgent;
  const isMobileDevice = /Mobi/i.test(ua);
  const rules = ["WebView", "(iPhone|iPod|iPad)(?!.*Safari/)", "Android.*(wv)"];
  const inAppRegex = new RegExp(`(${rules.join("|")})`, "ig");
  const isInApp = Boolean(ua.match(inAppRegex));
  const embeddedBrowsers = [
    /\bFB[\w_]+\/(Messenger|MESSENGER)/,
    /\bFB[\w_]+\//,
    /\bTwitter/i,
    /\bLine\//i,
    /\bMicroMessenger\//i,
    /\bPuffin/i,
    /\bMiuiBrowser\//i,
    /\bInstagram/i,
  ];
  const isEmbedded = embeddedBrowsers.some((regex) => regex.test(ua));
  return (
    touchEvents &&
    windowSizeCheck &&
    orientate &&
    isMobileDevice &&
    isInApp &&
    isEmbedded
  );
}

function guessAppBrowser() {
  const ua = window.navigator.userAgent;
  const browsers = [
    { name: "Messenger", regex: /\bFB[\w_]+\/(Messenger|MESSENGER)/ },
    { name: "Facebook", regex: /\bFB[\w_]+\// },
    { name: "Twitter", regex: /\bTwitter/i },
    { name: "Line", regex: /\bLine\//i },
    { name: "WeChat", regex: /\bMicroMessenger\//i },
    { name: "Puffin", regex: /\bPuffin/i },
    { name: "Miui", regex: /\bMiuiBrowser\//i },
    { name: "Instagram", regex: /\bInstagram/i },
  ];
  const inAppBrowser = browsers.find(({ regex }) => regex.test(ua));
  return inAppBrowser ? inAppBrowser.name : "Messenger";
}

export default function Login() {
  if (isEmbeddedBrowser()) {
    const appBrowser = guessAppBrowser();
    return (
      <section className="embedded-browser-alert">
        <h3>Action needed:</h3>
        <p>
          It looks like you&apos;re probably using {appBrowser}&apos;s in-app
          browser (or something similar).
          <br />
          Unfortunately you won&apos;t be able to sign in while using this
          embedded in-app browser. You&apos;ll need to use an external browser.
          <br />
          Please open this page in your favorite browser on your phone, such as
          Chrome, Safari, or Firefox.
        </p>
      </section>
    );
  }
  return (
    <section className="flex-center center">
      <GoogleSignIn />
    </section>
  );
}
