import { PrismaClient } from "@prisma/client";
import { categorias } from "./data/categorias";
import { productos } from "./data/productos";

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  await prisma.categoria.createMany({
    data: categorias,
  });
  await prisma.producto.createMany({
    data: productos,
  });
};
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
