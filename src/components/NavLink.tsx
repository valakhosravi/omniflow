"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  path: string;
  children: React.ReactNode;
}

export default function NavLink({ path, children }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={`block py-2 hover:text-secondary-900 transition-all ease-out
          ${pathname === path ? "text-primary-900" : ""}
        `}
      href={path}
    >
      {children}
    </Link>
  );
}
