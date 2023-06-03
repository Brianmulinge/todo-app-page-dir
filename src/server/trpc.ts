import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import SuperJSON from "superjson";
import { initTRPC} from "@trpc/server";
import { prisma } from "../../prisma/lib/prismadb";

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  return {
    req,
    res,
    prisma,
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: SuperJSON,
  errorFormatter: ({ shape }) => shape,
});

export const router = t.router;

export const publicProcedure = t.procedure;

