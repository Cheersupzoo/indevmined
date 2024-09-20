const { createInsertedInfoPrompt } = require('./prompt-gen-ans')
const fs = require('fs')

const thaKnowledge = createInsertedInfoPrompt()
const engKnowledge = createInsertedInfoPrompt('eng')

const fileContent = `export const knowledge = { tha: \`${thaKnowledge}\`, eng: \`${engKnowledge}\` }

`

fs.writeFileSync('./script/knowledge.js', fileContent)