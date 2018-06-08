const fs = require('fs-jetpack')
const os = require("os");
const bundlePackage = require('../package.json');

const EXTENSIONS_PATH = os.homedir() + '/.vscode/extensions'
const MARKETPLACE_URL = 'https://marketplace.visualstudio.com/items?itemName='

const packages = fs.find(EXTENSIONS_PATH, {matching: '!.*', directories: true, recursive: false}) // All first level directories that don't start with '.'
                    .map(packagePath => JSON.parse(fs.read(packagePath + '/package.json')))       // All package files as package JSON objects
                    .sort((a,b) => a.displayName.localeCompare(b.displayName))                    // Sort all packages by name

packages.forEach(package => {
    // Log out lines to insert in README
    console.log(makeMarkDownLink(package))
});

updatePackageJSON(packages);

function makeMarkDownLink(package) {
    return '- [' + package.displayName + '](' + MARKETPLACE_URL + makeExtensionID(package) + ') ' + package.description;
}

// update our extension list with current extensions
function updatePackageJSON(packages) {
    bundlePackage.extensionDependencies = packages.map(package => makeExtensionID(package))
                                                  .sort((a,b) => a.localeCompare(b))
    fs.write('../package.json', bundlePackage)
}

function makeExtensionID(package) {
    return package.publisher + '.' + package.name
}
