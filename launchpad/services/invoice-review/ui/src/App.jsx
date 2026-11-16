import React, { useEffect, useState } from "react";
import { Header, HeaderName, Content, Theme } from "@carbon/react";
import QueuePage from "./QueuePage.jsx";
import ReviewPage from "./ReviewPage.jsx";

// Hash routing (#/ and #/review/<id>) so the app works at any sub-domain root with no base path.
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const on = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const m = hash.match(/^#\/review\/(.+)$/);
  return m ? { page: "review", id: decodeURIComponent(m[1]) } : { page: "queue" };
}

export default function App() {
  const route = useHashRoute();
  return (
    <Theme theme="white">
      <Header aria-label="Invoice review">
        <HeaderName href="#/" prefix="Power demo">
          Invoice review
        </HeaderName>
      </Header>
      <Content className="app-content">
        {route.page === "review" ? <ReviewPage id={route.id} /> : <QueuePage />}
      </Content>
    </Theme>
  );
}
