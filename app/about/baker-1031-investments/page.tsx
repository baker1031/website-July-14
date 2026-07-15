import LegacyPage from "../../_components/LegacyPage";
import { loadLegacyPage } from "../../_lib/legacy-page";

export default async function AboutBakerPage() {
  return <LegacyPage legacyDocument={await loadLegacyPage("about-baker-1031-investments.html", "about")} />;
}
