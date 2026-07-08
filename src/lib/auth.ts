import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "resort_session";
const alg = "HS256";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET tanımlı değil. .env dosyanıza AUTH_SECRET ekleyin."
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  username: string;
  name: string;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
