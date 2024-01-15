import { createTRPCRouter } from "~/server/api/trpc";
import { trackRouter } from "./routers/tracks";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tracks: trackRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
