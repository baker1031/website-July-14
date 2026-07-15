import LegacyPage from "../_components/LegacyPage";
import { loadLegacyPage } from "../_lib/legacy-page";

export default async function AboutPage() {
  return <LegacyPage legacyDocument={await loadLegacyPage("about.html", "about")} />;
}
