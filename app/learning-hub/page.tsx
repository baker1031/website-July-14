import LegacyPage from "../_components/LegacyPage";
import { loadLegacyPage } from "../_lib/legacy-page";

export default async function LearningHubPage() {
  return <LegacyPage legacyDocument={await loadLegacyPage("learning-hub.html", "learning-hub")} />;
}
