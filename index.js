// Подключение зависимостей
const
  fs = require('fs'),
  TranspilerManager = require('./utils/TranspilerManager');

// чтение input'a и подключение транспилера
const
  input             = process.argv[2],
  transpilerName    = process.argv[3],
  ast               = JSON.parse(fs.readFileSync(input, 'utf-8')),
  transpilerManager = new TranspilerManager(transpilerName, require),
  transpiler        = transpilerManager.getTranspiler(ast);

// вывод результата
console.log(transpiler.transpile());

