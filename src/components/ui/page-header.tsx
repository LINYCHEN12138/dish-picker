import Link from "next/link";

export function PageHeader({ eyebrow, title, back }: { eyebrow: string; title: string; back?: boolean }) {
  return (
    <header className="page-header">
      {back && <Link href="/dishes" className="back-button" aria-label="返回点菜页">←</Link>}
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
    </header>
  );
}
