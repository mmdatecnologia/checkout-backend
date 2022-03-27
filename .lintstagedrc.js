const path = require('path')

const buildEslintCommand = (filenames) =>
{
  const files = filenames
    .map((f) => {
      const filename = path.relative(process.cwd(), f)
      if(!filename.startsWith('.'))
        return filename
    }).filter(function(x) {
      return x !== undefined;
 })
  if(files?.length > 0){
    return `npx eslint --fix ${files
      .map((f) => path.relative(process.cwd(), f))}`
  }
    return 'echo "No files to lint"'
    
}
const buildTestCommand = (filenames) =>
{
  const files = filenames
    .map((f) => {
      const filename = path.relative(process.cwd(), f)
      if(!filename.startsWith('.'))
        return filename
    }).filter(function(x) {
      return x !== undefined;
 })
  if(files?.length > 0){
    return `yarn test:staged ${files
      .map((f) => path.relative(process.cwd(), f))
      .join(' --file ')}`
  }
    return 'echo "No files to lint"'
    
}

const commands = []

if(buildEslintCommand){
  commands.push(buildEslintCommand)
}

module.exports = {
  '*.{js,jsx,ts,tsx}': commands,
}
