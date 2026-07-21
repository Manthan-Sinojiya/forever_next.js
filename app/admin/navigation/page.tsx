import { getMenus } from "@/actions/admin/navigation";
import NavigationClient from "./NavigationClient";

export default async function NavigationPage() {
  const { data = [] } = await getMenus();

  return <NavigationClient initialData={data} />;
}
