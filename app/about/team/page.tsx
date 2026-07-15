import LegacyPage from "../../_components/LegacyPage";
import { loadLegacyPage } from "../../_lib/legacy-page";

export default async function AboutTeamPage() {
  return <LegacyPage legacyDocument={await loadLegacyPage("about-team.html", "about")} />;
}
