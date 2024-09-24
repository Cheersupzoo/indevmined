const fs = require("fs");
const path = require("path");

const baseVault = `./vault`;
const baseVaultEN = `./vault/en`;

const files = fs.readdirSync(baseVault);

const imageReg = /\[(.*)\]\(.*\)/g;

files
  .filter((file) => file.endsWith(".md"))
  .slice(3, 4)
  .forEach((file) => {
    console.log(file);
    let rawText = fs.readFileSync(path.join(baseVault, file), "utf-8");
    const matches = rawText.match(new RegExp(imageReg));
    const imageFiles = matches
      .filter((match) => match.includes(" "))
      .map((match) => {
        console.log(match);
        const result = new RegExp(imageReg).exec(match);
        const fileName = result[1];

        return fileName;
      });
    imageFiles.forEach((file) => {
      if (!fs.existsSync(path.join(baseVault, file))) {
        throw new Error(file);
      }
    });
    imageFiles.forEach((file) => {
      const extension = file.split(".").pop();
      const newFileName = `${crypto.randomUUID()}.${extension}`;
      rawText = rawText.replace(
        `[${file}](${file})`,
        `[${newFileName}](${newFileName})`
      );
      fs.renameSync(path.join(baseVault, file), path.join(baseVault, newFileName))
    });
    fs.writeFileSync(path.join(baseVault, file), rawText)

  });
