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
  let prompt = ''
  mdFiles.forEach((_, index) => {
    const file = mdFiles[index]
    const raw = fs.readFileSync(path.join(baseVault, file), 'utf-8')
    prompt += `
  <POST>
  ${raw}
  </POST>
  `
  })

  return prompt
}

module.exports = { createInsertedInfoPrompt }
