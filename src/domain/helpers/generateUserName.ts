export function generateUserName(name: string): string {
  const username = name.trim().toLowerCase().replace(/\s+/g, "");

  const uniqueUsername = `${username}`;

  return uniqueUsername;
}
