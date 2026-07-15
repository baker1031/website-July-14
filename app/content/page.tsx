import LegacyPage from "../_components/LegacyPage";
import { loadLegacyPage } from "../_lib/legacy-page";

export default async function ContentPage() {
  return <LegacyPage legacyDocument={await loadLegacyPage("content.html", "content")} />;
}
