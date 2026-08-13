import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { answerCourseQuestion } from "./courseAssistant";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  courseAssistant: router({
    ask: publicProcedure
      .input(z.object({
        course: z.object({
          courseName: z.string().trim().min(1).max(300),
          description: z.string().trim().min(1).max(2_000),
          courseCode: z.string().max(120).optional(),
          mainCategory: z.string().max(160).optional(),
          shortCourse: z.string().max(160).optional(),
          courseType: z.string().max(160).optional(),
          pricePaise: z.number().finite().nonnegative().optional(),
          priceUsdCents: z.number().finite().nonnegative().optional(),
          refundable: z.boolean().optional(),
        }),
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().trim().min(1).max(1_200),
        })).min(1).max(8),
      }))
      .mutation(async ({ input }) => {
        try {
          return await answerCourseQuestion(input.course, input.messages);
        } catch (error) {
          console.error("[Course assistant] Request unavailable", error instanceof Error ? error.message : "unknown error");
          throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "The course assistant is unavailable right now. Please try again." });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
