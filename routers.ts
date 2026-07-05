import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createApplication, getApplicationById, listApplications } from "./db";
import { storagePut } from "./storage";
import { z } from "zod";

export const appRouter = router({
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

  application: router({
    submit: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(1),
          amount: z.string().min(1),
          description: z.string().min(1),
          imageBase64: z.string().optional(),
          imageName: z.string().optional(),
          imageType: z.string().refine(
            (val) => !val || ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"].includes(val),
            { message: "Desteklenmeyen dosya formatı" }
          ).optional(),
        }),
      )
      .mutation(async ({ input }) => {
        let imageKey: string | null = null;
        let imageUrl: string | null = null;

        if (input.imageBase64 && input.imageName && input.imageType) {
          const buffer = Buffer.from(input.imageBase64, "base64");
          // Server-side size validation (max 10MB)
          if (buffer.length > 10 * 1024 * 1024) {
            throw new Error("Dosya boyutu 10MB'dan büyük olamaz.");
          }
          const result = await storagePut(
            `applications/${input.imageName}`,
            buffer,
            input.imageType,
          );
          imageKey = result.key;
          imageUrl = result.url;
        }

        await createApplication({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          amount: input.amount,
          description: input.description,
          imageKey,
          imageUrl,
          createdAt: Date.now(),
        });

        return { success: true };
      }),

    list: adminProcedure.query(async () => {
      return listApplications();
    }),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getApplicationById(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
