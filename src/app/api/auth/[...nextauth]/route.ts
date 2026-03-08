import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async authorized({ auth }) {
      // Logged in users are authenticated
      return !!auth?.user;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  basePath: '/api/auth',
});

const { GET, POST } = handlers;
export { GET, POST, auth, signIn, signOut };
