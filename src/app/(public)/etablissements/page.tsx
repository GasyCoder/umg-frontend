import { publicGet } from "@/lib/public-api";
import EtablissementsPageClient from "./EtablissementsPageClient";

export const metadata = {
  title: "Établissements - Université de Mahajanga",
  description: "Les facultés, écoles et instituts de l'Université de Mahajanga",
};

type Etablissement = {
  id: number;
  name: string;
  slug: string;
  acronym: string | null;
  description: string | null;
  director_name: string | null;
  director_title: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: { url: string } | null;
  cover_image: { url: string } | null;
};

export default async function EtablissementsPage() {
  let etablissements: Etablissement[] = [];
  try {
    const res = await publicGet<{ data: Etablissement[] }>("/etablissements?per_page=50", 60);
    etablissements = res.data || [];
  } catch {
    // No etablissements yet
  }

  return <EtablissementsPageClient etablissements={etablissements} />;
}
