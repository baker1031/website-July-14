import LegacyPage from "./_components/LegacyPage";
import { loadLegacyPage } from "./_lib/legacy-page";

export default async function HomePage() {
  return <LegacyPage legacyDocument={await loadLegacyPage("index.html")} />;
}
