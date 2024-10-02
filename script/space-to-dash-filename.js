const fs = require('fs')
const path = require('path')

const baseVault = `./vault`;
const baseVaultEN = `./vault/en`;

const mdFiles = fs.readdirSync(baseVault).filter(file => file.endsWith('.md'))

mdFiles.forEach(file => {
    const newFileName = file.replace(/ /g, '-')
    fs.renameSync(path.join(baseVault, file), path.join(baseVault, newFileName))
})

const mdENFiles = fs.readdirSync(baseVaultEN).filter(file => file.endsWith('.md'))

mdENFiles.forEach(file => {
    const newFileName = file.replace(/ /g, '-').replace(/[\?\'\,]/g, '')
    fs.renameSync(path.join(baseVaultEN, file), path.join(baseVaultEN, newFileName))
})

console.log('done')