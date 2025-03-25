import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    };
    token: string;
    expires: string;
  }
  interface User {
    id: string;
    role: string;
    token: string;
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    token: string;
    expires: string;
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
        token.id = user.id;
        token.role = user.role;
        token.token = user.token;
        token.expires = user.expires;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.token = token.token;
        session.expires = token.expires;
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
            return {
              id: jsonData.user.id,
              role: jsonData.user.authorities[0].authority,
              token: jsonData.token,
              expires: jsonData.expires,
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
