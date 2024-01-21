import type { NextAuthOptions } from 'next-auth';
import FacebookProvider from "next-auth/providers/facebook";

export const options: NextAuthOptions = {
  providers: [
    FacebookProvider({
      idToken: true,
      clientId: '1361038827821051' as string,
      clientSecret: 'cad14b5e85a97174de6eedb7d1912589' as string,
      authorization: {
        url: 'https://www.facebook.com/v11.0/dialog/oauth',
        params: {
          client_id: '1361038827821051',
          response_type: 'code',
          scope: 'email,ads_read,public_profile,read_insights,pages_read_engagement,business_management',
          state: '631aa81eee2a93836053fb6e47809f292c2e6f0e456a5fa8ef2c6fd1206a1ffa'
        },
      },
      token: {
        url: 'https://graph.facebook.com/oauth/access_token',
        async request(context) {
          console.log('context >>', context);
          const url =
            `https://graph.facebook.com/oauth/access_token` +
            `?code=${context.params.code}` +
            `&client_id=${context.provider.clientId}` +
            `&redirect_uri=${context.provider.callbackUrl}` +
            `&client_secret=${context.provider.clientSecret}`;
          const response = await fetch(url);
          const tokens = await response.json();
          return { tokens };
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
    // async redirect({ url, baseUrl }: any) {
    //   return baseUrl
    // },
  },
};
