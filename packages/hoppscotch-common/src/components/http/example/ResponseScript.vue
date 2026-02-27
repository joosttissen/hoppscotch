<template>
  <div class="flex flex-1 flex-col">
    <div
      class="sticky top-upperMobileSecondaryStickyFold z-10 flex flex-shrink-0 items-center justify-between overflow-x-auto border-b border-dividerLight bg-primary pl-4 sm:top-upperSecondaryStickyFold"
    >
      <label class="truncate font-semibold text-secondaryLight">
        {{ t("preRequest.javascript_code") }}
      </label>
      <div class="flex">
        <HoppButtonSecondary
          v-tippy="{ theme: 'tooltip' }"
          :title="t('action.clear')"
          :icon="IconTrash2"
          @click="clearContent"
        />
        <HoppButtonSecondary
          v-tippy="{ theme: 'tooltip' }"
          :title="t('state.linewrap')"
          :class="{ '!text-accent': WRAP_LINES }"
          :icon="IconWrapText"
          @click.prevent="toggleNestedSetting('WRAP_LINES', 'httpResponseScript')"
        />
      </div>
    </div>
    <div class="flex flex-1 border-b border-dividerLight">
      <div class="h-full relative w-2/3 border-r border-dividerLight">
        <div
          ref="scriptEditor"
          class="h-full absolute inset-0"
        ></div>
      </div>
      <div
        class="z-[9] sticky top-upperTertiaryStickyFold h-full min-w-[12rem] max-w-1/3 flex-shrink-0 overflow-auto overflow-x-auto bg-primary p-4"
      >
        <div class="pb-2 text-secondaryLight">
          {{ t("helpers.post_response_script") }}
        </div>
        <h4 class="pt-6 font-bold text-secondaryLight">
          {{ t("preRequest.snippets") }}
        </h4>
        <div class="flex flex-col pt-4">
          <TabSecondary
            v-for="(snippet, index) in responseScriptSnippets"
            :key="`snippet-${index}`"
            :label="snippet.name"
            active
            @click="useSnippet(snippet.script)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCodemirror } from "@composables/codemirror"
import { useI18n } from "@composables/i18n"
import { useVModel } from "@vueuse/core"
import { reactive, ref } from "vue"

import { useNestedSetting } from "~/composables/settings"
import linter from "~/helpers/editor/linting/postResponseScript"
import completer from "~/helpers/editor/completion/postResponseScript"
import { toggleNestedSetting } from "~/newstore/settings"
import IconTrash2 from "~icons/lucide/trash-2"
import IconWrapText from "~icons/lucide/wrap-text"

const t = useI18n()

const props = defineProps<{
  modelValue: string
  isActive?: boolean
}>()
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const postResponseScript = useVModel(props, "modelValue", emit)
const scriptEditor = ref<any | null>(null)
const WRAP_LINES = useNestedSetting("WRAP_LINES", "httpResponseScript")

useCodemirror(
  scriptEditor,
  postResponseScript,
  reactive({
    extendedEditorConfig: {
      mode: "application/javascript",
      lineWrapping: WRAP_LINES,
      placeholder: `${t("preRequest.javascript_code")}`,
    },
    linter,
    completer,
    environmentHighlights: false,
    contextMenuEnabled: false,
  })
)

const responseScriptSnippets = [
  {
    name: "Response: Modify response body",
    script: `\n\n// Modify the response body
const body = JSON.parse(response.body);
body.timestamp = new Date().toISOString();
response.body = JSON.stringify(body);`,
  },
  {
    name: "Response: Set response header",
    script: `\n\n// Set a custom response header
response.headers["X-Custom-Header"] = "custom-value";`,
  },
  {
    name: "Response: Set status code",
    script: `\n\n// Change the response status code
response.statusCode = 200;`,
  },
  {
    name: "Request: Access request body",
    script: `\n\n// Access the incoming request body
const reqBody = request.body;`,
  },
  {
    name: "Request: Access request header",
    script: `\n\n// Access an incoming request header
const authHeader = request.headers["authorization"];`,
  },
  {
    name: "Request: Access query parameter",
    script: `\n\n// Access a query parameter from the request
const id = request.query["id"];`,
  },
]

const useSnippet = (script: string) => {
  postResponseScript.value += script
}

const clearContent = () => {
  postResponseScript.value = ""
}
</script>

<style lang="scss" scoped>
:deep(.cm-panels) {
  @apply top-upperTertiaryStickyFold #{!important};
}
</style>
