import { InferredEntity, createVersionedEntity, entityReference } from "verzod"
import { z } from "zod"
import V0_VERSION from "./v/0"
import V1_VERSION from "./v/1"
import {
  HoppRESTResOriginalReqSchemaVersion,
  HoppRESTResponseOriginalRequest,
} from "./original-request"

export { HoppRESTResponseOriginalRequest } from "./original-request"

const versionedObject = z.object({
  v: z.number(),
})

export const HoppRESTRequestResponse = createVersionedEntity({
  latestVersion: 1,
  versionMap: {
    0: V0_VERSION,
    1: V1_VERSION,
  },
  getVersion(data) {
    const versionCheck = versionedObject.safeParse(data)

    if (versionCheck.success) return versionCheck.data.v

    // If no v field but postResponseScript is present, treat as version 1
    // (data saved before the v field was introduced to V1_SCHEMA)
    if (
      typeof (data as Record<string, unknown>).postResponseScript === "string"
    ) {
      return 1
    }

    // Schema starts from version 0, so if the version is not present,
    // we assume it's version 0
    const result = V0_VERSION.schema.safeParse(data)
    return result.success ? 0 : null
  },
})

export type HoppRESTRequestResponse = InferredEntity<
  typeof HoppRESTRequestResponse
>

export const HoppRESTRequestResponses = z.record(
  z.string(),
  entityReference(HoppRESTRequestResponse)
)

export type HoppRESTRequestResponses = z.infer<typeof HoppRESTRequestResponses>

export function makeHoppRESTResponseOriginalRequest(
  x: Omit<HoppRESTResponseOriginalRequest, "v">
): HoppRESTResponseOriginalRequest {
  return {
    v: HoppRESTResOriginalReqSchemaVersion,
    ...x,
  }
}
