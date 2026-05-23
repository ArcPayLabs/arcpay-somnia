import Link from "next/link";
import { MarketingNav } from "./MarketingNav";

export function MarketingPage({ eyebrow, title, body }: { readonly eyebrow: string; readonly title: string; readonly body: string }) {
  return (
    <main className="marketing-page">
      <MarketingNav />
      <section className="static-marketing">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{body}</p>
        <div>
          <Link className="hero-primary" href="/dashboard">Open App</Link>
          <Link className="hero-secondary dark-text" href="/">Back home</Link>
        </div>
      </section>
    </main>
  );
}
