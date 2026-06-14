import { notFound } from "next/navigation";
import { getDishBySlug } from "@/services/dishService";
import { DishDetailAction } from "./dish-detail-action";
import { PageHeader } from "@/components/ui/page-header";
import { ThemeIcon } from "@/components/mobile-theme/theme-icon";

export default async function DishDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { dish } = await getDishBySlug(slug);
  if (!dish) notFound();
  return (
    <>
      <PageHeader eyebrow={dish.category} title={dish.name} back />
      <div className={`detail-hero tone-${dish.tone}`}><span>{dish.emoji}</span><div>{dish.tags.map((tag) => <b key={tag}>{tag}</b>)}</div></div>
      <section className="detail-intro"><p>{dish.description}</p><div><span><b>{dish.cookMinutes}</b> 分钟</span><span><b>{dish.difficulty}</b> 难度</span><span><b>{dish.servings}</b> 人份</span></div><DishDetailAction dish={dish} /></section>
      <section className="detail-section"><div className="section-head"><div><span className="mini-label">Ingredients</span><h2>准备食材</h2></div></div><div className="ingredient-columns"><div><h3>主要食材</h3>{dish.ingredients.map((item) => <p key={item.name}><span>{item.name}</span><b>{item.displayAmount}</b></p>)}</div><div><h3>调料</h3>{dish.seasonings.map((item) => <p key={item.name}><span>{item.name}</span><b>{item.displayAmount}</b></p>)}</div></div></section>
      <section className="detail-section"><div className="section-head"><div><span className="mini-label">Steps</span><h2>跟着做就好</h2></div></div><ol className="step-list">{dish.steps.map((step, index) => <li key={step.title}><b>{index + 1}</b><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol></section>
      <section className="tip-card"><span>小小提醒</span>{dish.tips.map((tip) => <p key={tip}>· {tip}</p>)}</section>
      <a className="video-link" href={dish.videoUrl} target="_blank" rel="noreferrer"><span><ThemeIcon name="play" size={16} /></span><div><b>看看视频教程</b><small>将在外部打开搜索结果</small></div><i>→</i></a>
    </>
  );
}
