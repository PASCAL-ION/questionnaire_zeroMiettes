import prisma from "@/lib/prisma";

export default async function AdminPage() {
  const users = await prisma.user.findMany();

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        Admin - Liste des candidats
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 sm:px-4 py-2">Nom</th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2">Disponibilité</th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2">Rôle</th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2">Compétences</th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2">Motivation</th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2">Outils</th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2">GitHub</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">{user.fullName}</td>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">{user.availability}</td>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">{user.role}</td>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">
                  {user.skills.join(", ")}
                </td>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">{user.motivation}</td>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">
                  {user.tools.join(", ")}
                </td>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">
                  <a
                    href={user.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {user.githubRepo}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}