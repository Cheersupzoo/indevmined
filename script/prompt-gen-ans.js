const fs = require('fs')
const path = require('path')

function createInsertedInfoPrompt(lang = 'tha') {
  let baseVault = `./vault`
  if (lang === 'eng') {
    baseVault = `./vault/en`
  }

  const mdFiles = fs
    .readdirSync(baseVault)
    .filter((file) => file.endsWith('.md'))

  const knowledgeList = mdFiles.map((_, index) => {
    const file = mdFiles[index]
    const raw = fs.readFileSync(path.join(baseVault, file), 'utf-8')

    return [file.replace('.md', ''), raw]
  })

  const knowledge = knowledgeList.reduce(
    (prev, [slug, raw]) => ({ ...prev, [slug]: raw }),
    {}
  )

  const titleSlugMap = new Map(
    knowledgeList.map(([slug, raw]) => {
      return [extractEnTitle(raw).title, slug]
    })
  )

  return [knowledge, Object.fromEntries(titleSlugMap.entries())]
}

function extractMetaPost(input) {
  const regex = /---([\s\S]*?)---/
  const match = input.match(regex)

  return match ? match[1].trim() : null
}

function createInsertedPostMeta(lang = 'tha') {
  let baseVault = `./vault`
  if (lang === 'eng') {
    baseVault = `./vault/en`
  }

  const mdFiles = fs
    .readdirSync(baseVault)
    .filter((file) => file.endsWith('.md'))
  let prompt = ''
  mdFiles.forEach((_, index) => {
    const file = mdFiles[index]
    const raw = fs.readFileSync(path.join(baseVault, file), 'utf-8')
    const meta = extractMetaPost(raw)
    prompt += `
  <POST_META>
  slug: ${file.replace('.md', '')}
  ${meta}
  </POST_META>
  `
  })

  return prompt
}

function queryNumberOfPost() {
  const baseVault = `./vault`

  const mdFiles = fs
    .readdirSync(baseVault)
    .filter((file) => file.endsWith('.md'))

  return mdFiles.length
}

const titleAndPublishedRegex =
  /---\s*[\s\S]*?title:\s*([^\n]+)[\s\S]*?language-en-link:\s*([^\n]+)[\s\S]*?published:\s*([^\n]+)[\s\S]*?---/

const extractTitleAndPublished = (text) => {
  const match = text.match(titleAndPublishedRegex)

  if (match) {
    const title = match[1].trim()
    const languageEnLink = match[2].trim()
    const published = match[3].trim()

    return { title, languageEnLink, published }
  } else {
    return {}
  }
}

const enTitleRegex = /---\s*[\s\S]*?title:\s*([^\n]+)[\s\S]*?---/

const extractEnTitle = (text) => {
  const match = text.match(enTitleRegex)

  if (match) {
    const title = match[1].trim()

    return { title }
  } else {
    return {}
  }
}

function queryLatestPostTitle() {
  const baseVault = `./vault`
  const baseVaultEN = `./vault/en`

  const mdFiles = fs
    .readdirSync(baseVault)
    .filter((file) => file.endsWith('.md'))
    .map((file) =>
      fs.readFileSync(`${baseVault}/${file}`, { encoding: 'utf-8' })
    )
    .map((md) => extractTitleAndPublished(md))
    .sort(
      (a, b) =>
        new Date(b.published).getTime() - new Date(a.published).getTime()
    )
  const latestFile = mdFiles[0]
  const enMdFile = latestFile.languageEnLink.slice(0, -3).split('|')[1]

  const enMdFileText = fs.readFileSync(`${baseVaultEN}/${enMdFile}.md`, {
    encoding: 'utf-8'
  })
  const enMeta = extractEnTitle(enMdFileText)

  return `${enMeta.title} (${latestFile.title})`
}

module.exports = {
  createInsertedInfoPrompt,
  createInsertedPostMeta,
  queryNumberOfPost,
  queryLatestPostTitle
}
