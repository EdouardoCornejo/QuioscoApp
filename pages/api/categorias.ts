import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Categoria } from "../../utils/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const categorias: Categoria[] = await prisma.categoria.findMany();

  res.status(200).json(categorias);
}
