"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";

const schema = z.object({
  fullName: z.string().min(1, "Merci d’indiquer ton nom complet."),
  availability: z.coerce
    .number({ invalid_type_error: "Merci d’entrer un nombre." })
    .min(1, "Indique un nombre d’heures supérieur à zéro."),
  role: z.string().min(1, "Merci de sélectionner un rôle."),
  skills: z.array(z.string()).nonempty("Sélectionne au moins une technologie."),
  motivation: z.string().min(1, "Merci d’expliquer ce qui te motive."),
  tools: z.array(z.string()).optional(),
  customTool: z.string().optional(),
  githubRepo: z
    .string()
    .url("L’URL du dépôt GitHub n’est pas valide.")
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function Form() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otherTool, setOtherTool] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      availability: 0,
      role: "",
      skills: [],
      motivation: "",
      tools: [],
      customTool: "",
      githubRepo: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const finalData = {
      ...data,
      tools:
        data.tools?.includes("Autre") && otherTool
          ? [...(data.tools?.filter((t) => t !== "Autre") ?? []), otherTool]
          : data.tools,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      const json = await res.json();

      if (json.success) {
        reset();
        router.push("test-technique/thanks");
      } else {
        console.log("Erreur : ", json.error);
      }
    } catch (err) {
      console.log("Erreur de soumission :", err);
    }

    setLoading(false);
  };

  const nextStep = async () => {
    let valid = false;

    if (step === 0) valid = await trigger("fullName");
    else if (step === 1) valid = await trigger("availability");
    else if (step === 2) valid = await trigger("role");
    else if (step === 3) valid = await trigger("skills");
    else if (step === 4) valid = await trigger("motivation");
    else if (step === 5) valid = await trigger("githubRepo");
    else if (step === 6) valid = await trigger("tools");

    if (valid) {
      setStep(step + 1);
    }
  };

  const totalSteps = 7;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-center justify-start p-6 text-[#06402B]"
    >
      <div className="mb-6 w-full max-w-2xl">
        <div className="h-2 w-full rounded bg-gray-300">
          <div
            className="h-2 rounded bg-[#06402B]"
            style={{ width: `${progress}%`, transition: "width 0.3s" }}
          />
        </div>
        <p className="mt-1 text-center text-sm text-[#06402B]">{`Étape ${step + 1} sur ${totalSteps}`}</p>
      </div>

      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <label htmlFor="fullName" className="block font-medium">
                  Quel est ton nom complet ?
                </label>
                <input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="Jean Dupont"
                  className="w-full rounded-lg border border-[#06402B] bg-white p-3 text-lg"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-4 w-full rounded-lg bg-[#06402B] p-3 text-white"
                >
                  Suivant
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <label className="block font-medium">
                  Combien d’heures par semaine peux-tu consacrer au projet ?
                </label>
                <input
                  type="number"
                  {...register("availability")}
                  className="w-full rounded-lg border border-[#06402B] bg-white p-3 text-lg"
                />
                {errors.availability && (
                  <p className="text-sm text-red-600">
                    {errors.availability.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-4 w-full rounded-lg bg-[#06402B] p-3 text-white"
                >
                  Suivant
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="block font-medium">
                  Quel rôle veux-tu occuper ?
                </label>
                <div className="space-y-2">
                  {[
                    "Développeur Frontend",
                    "Développeur Backend",
                    "Designer UX/UI",
                  ].map((role) => (
                    <label key={role} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={role}
                        {...register("role")}
                        className="mr-2"
                      />
                      {role}
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-4 w-full rounded-lg bg-[#06402B] p-3 text-white"
                >
                  Suivant
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <label className="block font-medium">
                  Quelles sont les technologies que tu maîtrises ?
                </label>
                <Controller
                  control={control}
                  name="skills"
                  render={({ field }) => (
                    <MultiSelector
                      values={field.value || []}
                      onValuesChange={field.onChange}
                      loop
                      className="w-full"
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="Choisis tes technos" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          <MultiSelectorItem value="React Native">
                            React Native
                          </MultiSelectorItem>
                          <MultiSelectorItem value="Tailwind CSS">
                            Tailwind CSS
                          </MultiSelectorItem>
                          <MultiSelectorItem value="Figma">
                            Figma
                          </MultiSelectorItem>
                          <MultiSelectorItem value="Supabase">
                            Supabase
                          </MultiSelectorItem>
                          <MultiSelectorItem value="PostgreSQL">
                            PostgreSQL
                          </MultiSelectorItem>
                          <MultiSelectorItem value="JAVA">
                            JAVA
                          </MultiSelectorItem>
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  )}
                />
                {errors.skills && (
                  <p className="text-sm text-red-600">
                    {errors.skills.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-4 w-full rounded-lg bg-[#06402B] p-3 text-white"
                >
                  Suivant
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <label className="block font-medium">
                  Pourquoi souhaites-tu rejoindre ce projet ?
                </label>
                <textarea
                  rows={4}
                  {...register("motivation")}
                  className="w-full rounded-lg border border-[#06402B] bg-white p-3 text-lg"
                />
                {errors.motivation && (
                  <p className="text-sm text-red-600">
                    {errors.motivation.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-4 w-full rounded-lg bg-[#06402B] p-3 text-white"
                >
                  Suivant
                </button>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-4">
                <label htmlFor="githubRepo" className="block font-medium">
                  Ton repo GitHub
                </label>
                <input
                  id="githubRepo"
                  {...register("githubRepo")}
                  placeholder="https://github.com/ton-repo"
                  className="w-full rounded-lg border border-[#06402B] bg-white p-3 text-lg"
                />
                {errors.githubRepo && (
                  <p className="text-sm text-red-600">
                    {errors.githubRepo.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-4 w-full rounded-lg bg-[#06402B] p-3 text-white"
                >
                  Suivant
                </button>
              </div>
            )}
            {step === 6 && (
              <div className="space-y-4">
                <label className="block font-medium">
                  Quels outils de gestion préfères-tu ?
                </label>
                <Controller
                  control={control}
                  name="tools"
                  render={({ field }) => {
                    const options = [
                      "Notion",
                      "Trello",
                      "Jira",
                      "Monday",
                      "Autre",
                    ];
                    const selected = field.value || [];

                    const toggleValue = (val: string) => {
                      const updated = selected.includes(val)
                        ? selected.filter((v) => v !== val)
                        : [...selected, val];
                      field.onChange(updated);
                    };

                    return (
                      <div className="space-y-2">
                        {options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              value={option}
                              checked={selected.includes(option)}
                              onChange={() => toggleValue(option)}
                              className="mr-2"
                            />
                            {option}
                          </label>
                        ))}
                        {selected.includes("Autre") && (
                          <input
                            type="text"
                            placeholder="Quel outil ?"
                            value={otherTool}
                            onChange={(e) => setOtherTool(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-[#06402B] bg-white p-3 text-lg"
                          />
                        )}
                      </div>
                    );
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-lg bg-[#06402B] p-3 text-white"
                >
                  {loading ? "Envoi en cours..." : "Envoyer mes réponses"}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </form>
  );
}
