import Link from "next/link";

const links = [
  { href: "/superadmin/dashboard", label: "Dashboard" },
  { href: "/superadmin/usuarios", label: "Usuários" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-md p-4">
      <h2 className="font-bold text-lg mb-6">Painel Superadmin</h2>
      <nav>
        <ul className="space-y-2">
          {links.map(link => (
            <li key={link.href}>
              <Link href={link.href} className="block px-2 py-2 rounded hover:bg-gray-100">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
