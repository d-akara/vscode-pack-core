const fs = require('fs-jetpack')
const os = require("os");
const bundlePackage = require('../package.json');

const EXTENSIONS_PATH = os.homedir() + '/.vscode/extensions'
const OUT_FILE = '/vscode-extensions.txt'

const packages = fs.find(EXTENSIONS_PATH, {matching: '!.*', directories: true, recursive: false})
                    .filter(path => path.startsWith('.'))
                    .map(packagePath => JSON.parse(fs.read(packagePath + '/package.json')))
                    .sort((a,b) => a.displayName.localeCompare(b.displayName))

packages.forEach(package => {
    console.log(makeMarkDownLink(package))
});

updatePackageJSON(packages);

// Log out lines for README
function makeMarkDownLink(package) {
    return '- [' + package.displayName + '](' + 'https://marketplace.visualstudio.com/items?itemName=' + package.name + ') ' + package.description;
}

// update our extension list with current extensions
function updatePackageJSON(packages) {
    bundlePackage.extensionDependencies = packages.map(package => package.publisher + '.' + package.name)
                                                  .sort((a,b) => a.localeCompare(b))
    fs.write('../package.json', bundlePackage)
}
