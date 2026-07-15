import LegacyPage from "../_components/LegacyPage";
import { loadLegacyPage } from "../_lib/legacy-page";

export default async function InvestmentsPage() {
  return <LegacyPage legacyDocument={await loadLegacyPage("property-exchange-cards.html", "investments")} />;
}
