import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { usePageData, usePageLang } from 'vuepress/client'
import type { GitPluginPageData } from '../../shared/index.js'
import { useGitLocaleConfig } from './useGitLocales.js'

export interface LastUpdated {
  /**
   * The date object of the last updated time
   */
  date: Date
  /**
   * The ISO string of the last updated time
   */
  iso: string
  /**
   * The formatted text of the last updated time
   */
  text: string
  /**
   * The locale of the last updated time
   */
  locale: string
}

export const useLastUpdated = (
  enabled: MaybeRefOrGetter<boolean> = true,
): ComputedRef<LastUpdated | null> => {
  const lang = usePageLang()
  const locale = useGitLocaleConfig()
  const page = usePageData<GitPluginPageData>()

  return computed(() => {
    if (!toValue(enabled)) return null

    const timeStamp =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      page.value.git?.updatedTime ?? page.value.git?.changelog?.[0].time

    if (!timeStamp) return null

    const date = new Date(timeStamp)

    const text = new Intl.DateTimeFormat(lang.value, {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(timeStamp)

    return {
      date,
      text,
      iso: date.toISOString(),
      locale: locale.value.latestUpdateAt,
    }
  })
}
