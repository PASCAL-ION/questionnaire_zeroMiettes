"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { questions } from "./questions";
import { QuestionField } from "./components/QuestionsField";

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
    const currentQuestion = questions[step];
    const isValid = await trigger(currentQuestion.id as keyof FormData);

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const totalSteps = questions.length;
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
            <QuestionField
              question={questions[step]}
              register={register}
              control={control}
              errors={errors}
              otherTool={otherTool}
              setOtherTool={setOtherTool}
            />
            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="mt-4 w-full rounded-lg bg-[#06402B] p-3 text-white"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-[#06402B] p-3 text-white"
              >
                {loading ? "Envoi en cours..." : "Envoyer mes réponses"}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </form>
  );
}