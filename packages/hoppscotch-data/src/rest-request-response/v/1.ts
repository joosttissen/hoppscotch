import { defineVersion } from "verzod"
import { z } from "zod"
import { V0_SCHEMA } from "./0"

export const V1_SCHEMA = V0_SCHEMA.extend({
  postResponseScript: z.string().catch(""),
})

export default defineVersion({
  initial: false,
  schema: V1_SCHEMA,
  up(old: z.infer<typeof V0_SCHEMA>) {
    return {
      ...old,
      postResponseScript: "",
    } as z.infer<typeof V1_SCHEMA>
  },
})
