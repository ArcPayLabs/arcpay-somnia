import type { LucideIcon } from "lucide-react";
import { PageHeader } from "./PageHeader";

export function AppPage({
  eyebrow,
  title,
  description,
  badges,
  cards,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly badges: string[];
  readonly cards: readonly {
    readonly title: string;
    readonly body: string;
    readonly icon: LucideIcon;
    readonly action?: React.ReactNode;
  }[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} badges={badges} />
      <section className="feature-page-grid section">
        {cards.map((card) => (
          <article className="app-feature-card" key={card.title}>
            <span><card.icon size={22} /></span>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
            {card.action ? <div className="feature-action">{card.action}</div> : null}
          </article>
        ))}
      </section>
    </>
  );
}
