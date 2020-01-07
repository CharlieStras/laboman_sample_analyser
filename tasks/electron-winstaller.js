// const electronInstaller = require("electron-winstaller");

// try {
//   await electronInstaller.createWindowsInstaller({
//     appDirectory: "/out/laboman-sample-analyser-win32-ia32",
//     outputDirectory: "/release",
//     authors: "charliestras",
//     exe: "lsa.exe"
//   });
//   console.log("It worked!");
// } catch (e) {
//   console.log(`No dice: ${e.message}`);
// }

const { MSICreator } = require("electron-wix-msi");

async function makeInstaller() {
  // Step 1: Instantiate the MSICreator
  const msiCreator = new MSICreator({
    appDirectory: "./out/lsa-win32-ia32",
    description: "My amazing Kitten simulator",
    exe: "lsa",
    name: "lsa",
    manufacturer: "Sysmex",
    version: "1.0.0",
    outputDirectory: "./release"
  });

  // Step 2: Create a .wxs template file
  await msiCreator.create();

  // Step 3: Compile the template to a .msi file
  await msiCreator.compile();
}

makeInstaller();
