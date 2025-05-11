import Form from "./form";

export default async function TestTechnique() {
  return (
    <div className={"flex h-[100%] mt-[200px] w-full items-center justify-center"}>
      <div className={"flex flex-col items-center gap-4"}>
        <p className={"text-2xl font-light mb-8 text-[#06402B]"}>
          Formulaire de recrutement Zéro-Miettes
        </p>
        <Form />
      </div>
    </div>
  );
}