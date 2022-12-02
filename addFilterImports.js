import insertLine from 'insert-line'
import path from 'path'
import fs from "fs"
import nthline from 'nthline'

const directoryPath = 'src/models/db/filter'
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  files.forEach(function (file) {
    if(file.endsWith("Filter.ts") && file != "db_SpecialFilter.ts") {
      const filePath = path.join(directoryPath, file)
      const lineToAdd = "import { SpecialFilter } from 'models/db/filter/db_SpecialFilter';"
      nthline(1, filePath).then(line => {
        if (line != lineToAdd)
          insertLine(filePath).contentSync(lineToAdd).at(2);
      })
    }
  });
});