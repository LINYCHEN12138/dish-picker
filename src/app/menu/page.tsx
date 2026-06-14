import { MenuDashboard } from "@/components/menu/menu-dashboard";
import { PageHeader } from "@/components/ui/page-header";

export default function MenuPage() {
  return <><PageHeader eyebrow="我们的餐桌" title="今晚菜单" /><MenuDashboard /></>;
}
