import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Google sign-in for the gated workspace.
 *
 * The site must build, deploy and render correctly with no credentials set —
 * a hackathon showcase should never 500 because an OAuth app has not been
 * registered yet. So auth is *conditional*: when the Google credentials are
 * absent the provider list is empty, `authEnabled` is false, and the workspace
 * renders a setup panel instead of a sign-in flow.
 *
 * To turn it on, set AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET and AUTH_SECRET.
 * See .env.example for how to obtain them.
 */
export const authEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID &&
    process.env.AUTH_GOOGLE_SECRET &&
    process.env.AUTH_SECRET
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Empty when unconfigured: no provider means no session can ever be issued,
  // which is why the fallback secret below cannot be used to forge one.
  providers: authEnabled
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
          authorization: {
            params: { prompt: "consent", access_type: "offline", response_type: "code" },
          },
        }),
      ]
    : [],
  secret: process.env.AUTH_SECRET ?? "unconfigured-placeholder-no-providers-mounted",
  session: { strategy: "jwt" },
  pages: { signIn: "/workspace" },
  trustHost: true,
});
