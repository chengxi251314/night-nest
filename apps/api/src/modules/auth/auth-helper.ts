const tokens = new Map<string, string>();

export function setToken(token: string, userId: string) {
  tokens.set(token, userId);
}

export function getTokenUserId(token: string): string | null {
  return tokens.get(token) || null;
}

export function getUserIdFromAuth(auth: string | undefined): string {
  if (!auth) return "demo-user";
  const token = auth.replace("Bearer ", "");
  const userId = tokens.get(token);
  return userId || "demo-user";
}

export function generateAuthToken(userId: string): string {
  const token = "nn_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
  tokens.set(token, userId);
  return token;
}
