import { keys, startsWith } from '@vuepress/helper'
import type { HeadConfig } from 'vuepress/core'
import type {
  ArticleSchema,
  ArticleSeoContent,
  BlogPostingSchema,
  SeoContent,
  WebPageSchema,
} from '../typings/index.js'

interface MetaOptions {
  name: string
  content: string
  attribute?: string
}

const appendMetaToHead = (
  head: HeadConfig[],
  {
    name,
    content,
    attribute = ['article:', 'og:'].some((type) => startsWith(name, type))
      ? 'property'
      : 'name',
  }: MetaOptions,
): void => {
  if (content) head.unshift(['meta', { [attribute]: name, content }])
}

export const addOGP = (head: HeadConfig[], content: SeoContent): void => {
  keys(content)
    .reverse()
    .forEach((property) => {
      switch (property) {
        case 'article:tag':
          ;(content as ArticleSeoContent)['article:tag']!.forEach(
            (tag: string) => {
              appendMetaToHead(head, { name: 'article:tag', content: tag })
            },
          )
          break
        case 'og:locale:alternate':
          content['og:locale:alternate'].forEach((locale: string) => {
            if (locale !== content['og:locale'])
              appendMetaToHead(head, {
                name: 'og:locale:alternate',
                content: locale,
              })
          })
          break
        default:
          if (content[property as keyof SeoContent] as string)
            appendMetaToHead(head, {
              name: property,
              content: content[property as keyof SeoContent] as string,
            })
      }
    })
}

export const appendJSONLD = (
  head: HeadConfig[],
  content: ArticleSchema | BlogPostingSchema | WebPageSchema,
): void => {
  head.unshift([
    'script',
    { type: 'application/ld+json' },
    JSON.stringify(content),
  ])
}

export const appendCanonical = (
  head: HeadConfig[],
  url?: string | null,
): void => {
  if (url) head.unshift(['link', { rel: 'canonical', href: url }])
}

export const appendAlternate = (
  head: HeadConfig[],
  urls: { lang: string; path: string }[],
): void => {
  urls.forEach(({ lang, path }) => {
    head.unshift([
      'link',
      { rel: 'alternate', hreflang: lang.toLowerCase(), href: path },
    ])
  })
}
