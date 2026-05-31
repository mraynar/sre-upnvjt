import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            role: true,
            department: true,
            division: true
          }
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        if (!user.isActive) {
          throw new Error("This account is inactive");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          roleName: user.role?.name,
          permissions: user.role?.permissions,
          departmentCode: user.department?.code,
          departmentName: user.department?.name,
          divisionName: user.division?.name,
          positionName: user.positionName,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roleName = user.roleName;
        token.permissions = user.permissions;
        token.departmentCode = user.departmentCode;
        token.departmentName = user.departmentName;
        token.divisionName = user.divisionName;
        token.positionName = user.positionName;
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
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_only",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
