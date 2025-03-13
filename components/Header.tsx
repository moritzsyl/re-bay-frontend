"use client";

import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AuthCard from "./AuthCard";

export default function Header() {
  const [isAuthCardOpen, setIsAuthCardOpen] = useState(false);
  const { data: session } = useSession();

  const isProvider = session?.user?.role === "ROLE_ANBIETER";
  const isConsumer = session?.user?.role === "ROLE_ABNEHMER";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/rebay_logo_untransparent.jpeg" alt="Logo" width={110} height={110} />
        </Link>
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Link
                href="https://projekte.tgm.ac.at/re-bay/"
                className="text-gray-600 hover:text-gray-900"
                target="_blank"
              >
                Über uns
              </Link>
            </li>
            <li>
              <Link
                href="/produkte"
                className="text-gray-600 hover:text-gray-900"
              >
                Produktkatalog
              </Link>
            </li>
            {session ? (
              <>
                {isProvider && (
                  <li>
                    <Link
                      href="/meineprodukte"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Meine Produkte
                    </Link>
                  </li>
                )}
                {isConsumer && (
                  <li>
                    <Link
                      href="/meineanfragen"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Meine Anfragen
                    </Link>
                  </li>
                )}
                <li>
                  <Button
                    onClick={() => signOut()}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-gray-800 bg-white",
                      "border border-green-300 transition-shadow",
                      "hover:bg-gradient-to-r hover:from-white hover:to-green-100",
                      "hover:border-green-400 hover:shadow-md",
                      "focus:outline-none focus:ring-2 focus:ring-green-200"
                    )}
                  >
                    Abmelden
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Button
                  onClick={() => setIsAuthCardOpen(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Anmelden
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
      {isAuthCardOpen && <AuthCard onClose={() => setIsAuthCardOpen(false)} />}
    </header>
  );
}
