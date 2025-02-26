import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Umleitung zur Login-Seite, wenn nicht eingeloggt
  },
});

export const config = {
  matcher: ["/meineanfragen", "/meineprodukte"], // Geschützte Routen
};