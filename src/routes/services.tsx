import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ResourceCard } from "@/components/PageShell";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Local Services — Seattle Together" },
      { name: "description", content: "Find trusted local services in Seattle, WA: food assistance, healthcare, family support, housing, and more." },
      { property: "og:title", content: "Local Services in Seattle, WA" },
      { property: "og:description", content: "Trusted businesses and essential services across Seattle." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { category: "Food", title: "Hopelink Food Bank", description: "Free groceries, meals, and nutrition support for Redmond families.", meta: "Mon–Fri · 10am–4pm", accent: "rose" as const },
  { category: "Healthcare", title: "Eastside Community Clinic", description: "Sliding-scale primary care, dental, and behavioral health.", meta: "Walk-ins welcome", accent: "sage" as const },
  { category: "Housing", title: "Redmond Housing Resources", description: "Rental assistance, emergency shelter referrals, and tenant rights info.", meta: "Call 425-556-2900", accent: "primary" as const },
  { category: "Family", title: "Together Center", description: "Parenting classes, childcare resources, and youth programming.", accent: "crimson" as const },
  { category: "Seniors", title: "Redmond Senior & Community Center", description: "Daily activities, meals, transit help, and wellness programs.", meta: "8703 160th Ave NE", accent: "sage" as const },
  { category: "Education", title: "King County Library — Redmond", description: "Free Wi-Fi, study rooms, ESL classes, and tutoring for all ages.", accent: "rose" as const },
  { category: "Jobs", title: "WorkSource Redmond", description: "Job search help, resume coaching, and career training referrals.", accent: "primary" as const },
  { category: "Mental Health", title: "Crisis Connections (24/7)", description: "Free confidential support line for anyone in emotional distress.", meta: "Call or text 988", accent: "crimson" as const },
  { category: "Pets", title: "Redmond Animal Hospital Network", description: "Low-cost vaccines, spay/neuter clinics, and lost-pet recovery.", accent: "sage" as const },
];

function ServicesPage() {
  return (
    <PageShell
      eyebrow="Services"
      title="Help, when you need it."
      intro="A curated list of local organizations, clinics, and programs that serve Redmond residents. Free or low-cost, all year round."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pb-16">
        {services.map((s) => (
          <ResourceCard key={s.title} {...s} />
        ))}
      </div>
    </PageShell>
  );
}