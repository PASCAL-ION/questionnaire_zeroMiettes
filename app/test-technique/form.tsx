'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { questions } from "./questions"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { useState } from "react"

const formSchema = z.object({
  fullName: z.string().min(1, "Le nom est requis"),
  availability: z.coerce.number().min(1, "Indique une valeur supérieure à 0"),
  role: z.string().min(1, "Choisis un rôle"),
  skills: z.array(z.string()).optional(),
  motivation: z.string().min(1, "Exprime ta motivation")
})

type FormSchema = z.infer<typeof formSchema>

export default function Form() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        reset();
        router.push("test-technique/thanks");
      } else {
        console.error("Erreur lors de la soumission :", result.error);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    } finally {
      setIsLoading(false)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  const fields = [
    {
      label: "Quel est ton nom complet ?",
      helper: "Pour pouvoir te contacter de manière personnalisée.",
      field: (
        <>
          <Input id="fullName" {...register("fullName")} placeholder="Jean Dupont" className="bg-white border border-[#113532] focus:ring-[#113532] text-[#113532]" />
          {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName.message}</p>}
        </>
      )
    },
    {
      label: "Combien d’heures par semaine peux-tu consacrer au projet ?",
      helper: "Estimation honnête, même si c’est peu !",
      field: (
        <>
          <Input type="number" {...register("availability")} className="bg-white border border-[#113532] focus:ring-[#113532] text-[#113532]" />
          {errors.availability && <p className="text-red-600 text-sm">{errors.availability.message}</p>}
        </>
      )
    },
    {
      label: "Quel rôle veux-tu occuper ?",
      helper: "Choisis celui qui te correspond le mieux.",
      field: (
        <>
          {questions.find(q => q.id === "role")?.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2 mt-1 text-[#113532]">
              <input type="radio" value={opt} {...register("role")} />
              <span>{opt}</span>
            </label>
          ))}
          {errors.role && <p className="text-red-600 text-sm">{errors.role.message}</p>}
        </>
      )
    },
    {
      label: "Quelles sont les technologies que tu maîtrises ?",
      helper: "Ctrl + clic pour sélection multiple",
      field: (
        <select multiple {...register("skills")} className="w-full border border-[#113532] p-2 rounded bg-white text-[#113532]">
          {questions.find(q => q.id === "skills")?.options?.map((tech) => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </select>
      )
    },
    {
      label: "Pourquoi souhaites-tu rejoindre ce projet anti-gaspi ?",
      helper: "Dis-nous ce qui te motive !",
      field: (
        <>
          <textarea
            {...register("motivation")}
            className="w-full border border-[#113532] p-2 rounded bg-white text-[#113532]"
            rows={4}
          />
          {errors.motivation && <p className="text-red-600 text-sm">{errors.motivation.message}</p>}
        </>
      )
    }
  ]

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto p-6 bg-[#ffd2a9] text-[#113532] rounded-2xl shadow-xl space-y-8"
    >
      {fields.map(({ label, helper, field }, i) => (
        <motion.div key={i} custom={i} variants={fadeInUp} className="space-y-2">
          <label className="font-semibold text-lg block">{label}</label>
          <p className="text-sm text-[#113532]/80">{helper}</p>
          {field}
        </motion.div>
      ))}

      <motion.div variants={fadeInUp} custom={fields.length}>
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
          className={`flex items-center justify-center gap-2 bg-[#113532] text-[#FFBB7C] py-3 px-6 rounded-xl shadow-md transition duration-200 font-semibold ${
            isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'
          }`}
        >
          {isLoading && (
            <motion.div
              className="w-4 h-4 border-2 border-t-[#FFBB7C] border-[#FFBB7C]/30 rounded-full animate-spin"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
            />
          )}
          {isLoading ? "Envoi en cours..." : "Envoyer mes réponses"}
        </motion.button>
      </motion.div>
    </motion.form>
  )
}
