import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      token: string;
    };
  }
  interface User {
    role: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    token: string;
  }
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.token = token.token as string;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch("http://localhost:8050/account/login", {
            method: "POST",
            body: JSON.stringify({
              loginContactEmail: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const jsonData = await res.json();

          if (res.ok && jsonData) {
            console.log("Anmeldung erfolgreich. Hello" + jsonData.user.loginContactEmail);
            return {
              id: jsonData.user.id,
              email: jsonData.user.loginContactEmail,
              role: jsonData.user.authorities[0].authority,
              token: jsonData.token,
            };
          } else {
            return null;
          }
        } catch (err) {
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
