
export type Question = {
  id: string;
  type: "text" | "number" | "radio" | "multiselect" | "textarea" | "checkbox";
  title: string;
  description: string;
  required?: boolean;
  options?: string[];
};

export const questions: Question[] = [
  {
    id: "fullName",
    type: "text",
    title: "Quel est ton nom complet ?",
    description: "Pour pouvoir te contacter de manière personnalisée.",
    required: true,
  },
  {
    id: "availability",
    type: "number",
    title: "Combien d’heures par semaine peux-tu consacrer au projet ?",
    description: "Estimation honnête, même si c’est peu !",
    required: true,
  },
  {
    id: "role",
    type: "radio",
    title: "Quel rôle veux-tu occuper ?",
    description: "Choisis celui qui te correspond le mieux.",
    options: ["Développeur Frontend", "Développeur Backend", "Designer UX/UI"],
    required: true,
  },
  {
    id: "skills",
    type: "multiselect",
    title: "Quelles sont les technologies que tu maîtrises ?",
    description: "Les langages/technologies que tu connais.",
    options: ["React Native", "Tailwind CSS", "Figma", "Supabase", "PostgreSQL", "JAVA"],
    required: true,
  },
  {
    id: "motivation",
    type: "textarea",
    title: "Pourquoi souhaites-tu rejoindre ce projet anti-gaspi ?",
    description: "Dis-nous ce qui te motive !",
    required: true,
  },
  {
    id: "tools",
    type: "checkbox",
    title: "Quels outils de gestion préfères-tu ?",
    description: "Tu peux en choisir plusieurs. Si tu en utilises un autre, indique-le.",
    options: ["Notion", "Trello", "Jira", "Monday", "Autre"],
    required: false,
  },
  {
    id: "githubRepo",
    type: "text",
    title: "Ton repo GitHub",
    description: "Partage un lien vers un de tes dépôts si tu veux.",
    required: false,
  },
];