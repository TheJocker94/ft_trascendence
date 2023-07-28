import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({ data: { username: "El_Raton", email: "elgrossoraton@gmail.com" } })
  console.log(user)
  return user
}

main()
  .catch(e => {
    console.error(e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
export default main;