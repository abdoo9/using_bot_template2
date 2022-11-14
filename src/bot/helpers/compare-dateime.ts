// // this is because upsert does not return if the record was created or updated
// https://github.com/prisma/prisma/discussions/3432#discussioncomment-3099451

export function isNewBot(updatedAt: Date, createdAt: Date): boolean {
  return updatedAt.getTime() - createdAt.getTime() < 100;
}
