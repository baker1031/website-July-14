import type { Metadata } from "next";
import CrmApp from "./components";

export const metadata: Metadata = {
  title: "Baker 1031 CRM",
  description: "Baker 1031 client relationship management workspace.",
};

export default function CrmPage() {
  return <CrmApp />;
}
