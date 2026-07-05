import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { user, role, department, division } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const foundUser = await db.query.user.findFirst({
          where: eq(user.email, credentials.email),
          with: {
            role: true,
            department: true,
            division: true
          }
        });

        if (!foundUser) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          foundUser.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        if (!foundUser.isActive) {
          throw new Error("This account is inactive");
        }

        return {
          id: foundUser.id.toString(),
          name: foundUser.name,
          email: foundUser.email,
          roleName: foundUser.role?.name,
          permissions: foundUser.role?.permissions,
          departmentCode: foundUser.department?.code,
          departmentName: foundUser.department?.name,
          divisionName: foundUser.division?.name,
          positionName: foundUser.positionName,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user: authUser }) {
      if (authUser) {
        token.id = authUser.id;
        token.roleName = authUser.roleName;
        token.permissions = authUser.permissions;
        token.departmentCode = authUser.departmentCode;
        token.departmentName = authUser.departmentName;
        token.divisionName = authUser.divisionName;
        token.positionName = authUser.positionName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.roleName = token.roleName;
        session.user.permissions = token.permissions;
        session.user.departmentCode = token.departmentCode;
        session.user.departmentName = token.departmentName;
        session.user.divisionName = token.divisionName;
        session.user.positionName = token.positionName;
      }
      return session;
    },
    // Redirect users with unrecognized roles back to the homepage.
    // Recognized roles: SUPER_ADMIN and any role that starts with a known prefix.
    // Visitors who somehow log in with an unknown role see no special UI —
    // they are simply dropped back at `/` as a regular visitor.
    async redirect({ url, baseUrl, token }) {
      const roleName = token?.roleName;
      const KNOWN_ROLES = ["SUPER_ADMIN", "KETUA", "WAKIL_KETUA", "SEKRETARIS", "BENDAHARA", "MEMBER", "ALUMNI", "STAFF"];
      const isKnownRole = roleName && KNOWN_ROLES.includes(roleName);

      if (!isKnownRole) {
        // Unknown role → treat as a visitor, go home
        return baseUrl + "/";
      }
      // Known role → respect the intended callbackUrl, but stay within the app
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_only",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
