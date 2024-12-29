const fs = require('fs');
const path = require('path');

function process(fileContent) {
  const lines = fileContent.split('\n');
  const result = {
    name: '',
    author: '',
    description: '',
    pattern: []
  };

  const patternLines = [];

  for (const line of lines) {
    if (line.startsWith('!')) {
      const comment = line.substring(1).trim(); // Remove the "!" and trim whitespace
      if (comment.startsWith('Name:')) {
        result.name = comment.substring(5).trim(); // Extract name after "Name:"
      } else if (result.name == '') { // Use the first line for a name if there's nothing else.
        result.name = comment.trim();
      } else if (comment.startsWith('Author:')) {
        result.author = comment.substring(7).trim(); // Extract author after "Author:"
      } else {
        result.description += comment + '\n'; // Add to description
      }
    } else if (line.trim() !== '') {
      patternLines.push(line);
    }
  }

  result.description = result.description.trim();

  result.pattern = patternLines.map(line =>
    line.trim().split('').map(char => (char === '.' ? 0 : 1))
  );

  return result;
}

const dataDir = path.join(__dirname, 'patterns');
const outputFile = path.join(__dirname, 'patterns.json');

const results = {};

fs.readdir(dataDir, (err, files) => {
  if (err) {
    console.error("Error reading data directory:", err);
    process.exit(1);
  }

  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const processedFile = process(fileContent);
    results[processedFile.name] = processedFile;
  });

  try {
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log("Data processed and saved to data.json");
  } catch (writeErr) {
    console.error("Error writing to data.json:", writeErr);
    process.exit(1);
  }
});
