import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import prisma from "../../../prisma/lib/prismadb";

export const todoRouter = router({
  gettodo: publicProcedure.query(async () => {
    const todo = await prisma.todo.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return todo;
  }),

  createtodo: publicProcedure
    .input(
      z.object({
        todotitle: z
          .string()
          .min(1, "Content must be at least 1 character long")
          .max(500, "Content must be at most 500 characters long"),
        isCompleted: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const todo = await prisma.todo.create({
        data: {
          ...input,
        },
      });
      return todo;
    }),
  updatetodo: publicProcedure
    .input(
      z.object({
        todoId: z.string().cuid(),
        todotitle: z.string(),
        isCompleted: z.boolean(),
        updatedAt: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      const todo = await prisma.todo.update({
        where: {
          todoId: input.todoId,
        },
        data: {
          ...input,
        },
      });
      return todo;
    }),
  deletetodo: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      await prisma.todo.delete({
        where: {
          todoId: id,
        },
      });
      return id;
    }),
});

export type TodoRouter = typeof todoRouter;
