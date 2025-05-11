import { Controller, UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { Question } from "../questions";
import React from "react";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";

interface FormValues {
  fullName: string;
  availability: number;
  role: string;
  skills: [string, ...string[]];
  motivation: string;
  tools?: string[];
  githubRepo?: string;
  customTool?: string;
}

type Props = {
  question: Question;
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  otherTool?: string;
  setOtherTool?: (val: string) => void;
};

export function QuestionField({
  question,
  register,
  control,
  errors,
  otherTool,
  setOtherTool,
}: Props) {
  const { id, type, title, options } = question;

  const error = errors?.[id as keyof FormValues]?.message as string | undefined;

  if (type === "text" || type === "number") {
    return (
      <div className="space-y-2">
        <label className="font-medium">{title}</label>
        <input
          type={type}
          {...register(id as keyof FormValues)}
          className="w-full rounded-lg border border-[#06402B] bg-white p-3 text-lg"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (type === "radio" && options) {
    return (
      <div className="space-y-2">
        <label className="font-medium">{title}</label>
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="radio"
              value={option}
              {...register(id as keyof FormValues)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="space-y-2">
        <label className="font-medium">{title}</label>
        <textarea
          rows={4}
          {...register(id as keyof FormValues)}
          className="w-full rounded-lg border border-[#06402B] bg-white p-3 text-lg"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (type === "multiselect" && options) {
    return (
      <div className="space-y-2">
        <label className="font-medium">{title}</label>
        <Controller
          control={control}
          name={id as keyof FormValues}
          render={({ field }) => (
            <MultiSelector
              values={(field.value as string[]) || []}
              onValuesChange={field.onChange}
              loop
              className="w-full"
            >
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder="Choisis tes technos" />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {options.map((option) => (
                    <MultiSelectorItem key={option} value={option}>
                      {option}
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
          )}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (type === "checkbox" && options) {
    return (
      <div className="space-y-2">
        <label className="font-medium">{title}</label>
        <Controller
          control={control}
          name={id as keyof FormValues}
          render={({ field }) => {
            const selected = (field.value as string[]) || [];
            const toggleValue = (val: string) => {
              const updated = selected.includes(val)
                ? selected.filter((v) => v !== val)
                : [...selected, val];
              field.onChange(updated);
            };

            return (
              <>
                {options.map((option) => (
                  <label key={option} className="flex items-center gap-2">
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
                    onChange={(e) => setOtherTool?.(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#06402B] bg-white p-3 text-lg"
                  />
                )}
              </>
            );
          }}
        />
      </div>
    );
  }

  return null;
}