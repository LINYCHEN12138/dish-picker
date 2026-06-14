import { DishBrowser } from "@/components/dishes/dish-browser";
import { PageHeader } from "@/components/ui/page-header";

export default function DishesPage() {
  return <><PageHeader eyebrow="今晚想吃点什么" title="慢慢挑，选喜欢的" /><DishBrowser /></>;
}
