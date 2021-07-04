const cmd = require('node-cmd')
cmd.run('npm start')

// Use startscript to overcome following issue:

// C:\PROGRAM FILES\NODEJS\NPM.CMD:1
// (function (exports, require, module, __filename, __dirname) { :: Created by npm, please don't edit manually.
//                                                               ^

// SyntaxError: Unexpected token :
//     at new Script (vm.js:80:7)
//     at createScript (vm.js:274:10)
//     at Object.runInThisContext (vm.js:326:10)
//     at Module._compile (internal/modules/cjs/loader.js:664:28)
//     at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
//     at Module.load (internal/modules/cjs/loader.js:600:32)
//     at tryModuleLoad (internal/modules/cjs/loader.js:539:12)
//     at Function.Module._load (internal/modules/cjs/loader.js:531:3)
//     at Object.<anonymous> (C:\Users\potwo01\AppData\Roaming\npm\node_modules\pm2\lib\ProcessContainerFork.js:27:21)
//     at Module._compile (internal/modules/cjs/loader.js:701:30)
