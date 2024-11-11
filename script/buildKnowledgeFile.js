const {
  createInsertedInfoPrompt,
  createInsertedPostMeta,
  queryNumberOfPost,
  queryLatestPostTitle
} = require('./prompt-gen-ans')
const fs = require('fs')

const [thaKnowledge, thaTitleSlugMap] = createInsertedInfoPrompt()
const [engKnowledge, engTitleSlugMap] = createInsertedInfoPrompt('eng')

const knowledge = { ...thaKnowledge, ...engKnowledge }
const titleSlugMap = { ...thaTitleSlugMap, ...engTitleSlugMap }

const thaMeta = createInsertedPostMeta()
const engMeta = createInsertedPostMeta('eng')

const fileContent = `export const knowledge = ${JSON.stringify(
  knowledge,
  null,
  2
)}

export const postMeta = { tha: \`${thaMeta}\`, eng: \`${engMeta}\` }

export const titleSlugMap = ${JSON.stringify(titleSlugMap, null, 2)}

export const numberOfPost = ${queryNumberOfPost()}

export const latestPostTitle = '${queryLatestPostTitle()}'

`

fs.writeFileSync('./script/knowledge.js', fileContent)
