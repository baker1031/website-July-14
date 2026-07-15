import LegacyPage from "../../_components/LegacyPage";
import { loadLegacyPage } from "../../_lib/legacy-page";

export default async function AboutJerryBakerPage() {
  return <LegacyPage legacyDocument={await loadLegacyPage("about-jerry-baker.html", "about")} />;
}
