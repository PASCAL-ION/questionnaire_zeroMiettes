import Form from "./form";
import Link from "next/link";

export default async function TestTechnique() {
  return (
    <div className={"flex relative h-[100%] mt-[150px] w-full items-center justify-center"}>
        <Link href="/test-technique/admin/login">
          <button className="mt-4 rounded-lg bg-[#06402B] px-4 py-2 text-white hover:bg-[#00472d] absolute top-[0] right-[0]">
            Admin
          </button>
        </Link>
      <div className={"flex flex-col items-center gap-4"}>
        <p className={"text-2xl font-light mb-8 text-[#06402B]"}>
          Formulaire de recrutement Zéro-Miettes
        </p>
        <Form />
      </div>
    </div>
  );
}