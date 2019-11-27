const inquirer = require('inquirer');
const fs = require('fs-extra');
const commander = require('commander');
const chalk = require('chalk');
const cp = require("child_process");
const rimraf = require("rimraf");
const Listr = require('listr');

const packageJson = require('./package.json');

let projectName;

new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action(name => {
        projectName = name;
    }).parse(process.argv);

if (!projectName) {
    const projectQuestions = [
        {
            name: 'project-name',
            type: 'input',
            message: 'Project name:',
            validate: function (input) {
                if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
                else return 'Project name may only include letters, numbers, underscores and hashes.';
            }
        }
    ];

    inquirer.prompt(projectQuestions)
        .then(answers => {
            createTemplate(answers['project-name']);
        });
} else {
    createTemplate(projectName);
}

function getCurrentWorkingDirectory() {
    return process.cwd();
}

function createTemplate(projectName) {
    const templatePath = `${__dirname}/templates`;
    const projectPath = `${getCurrentWorkingDirectory()}/${projectName}`;

    const performCreate = (replaceExisting) => {

        const tasks = new Listr([
            {
                title: "Initialize Directory",
                task: () => {
                    return new Listr([
                        {
                            title: "Removing existing directory",
                            enabled: () => replaceExisting,
                            task: () => {
                                return new Promise((resolve, reject) => {
                                    try {
                                        rimraf(projectPath, (error) => {
                                            if (error) {
                                                reject(error);
                                            } else {
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }
                        },
                        {
                            title: "Initialize directory",
                            task:
                                () => {
                                    return new Promise((resolve, reject) => {
                                        try {
                                            fs.mkdirp(projectPath).then(_ => {
                                                resolve();
                                            }).catch(err => {
                                                reject(err);
                                            });
                                        } catch (e) {
                                            reject(e);
                                        }
                                    })
                                }
                        }
                    ], { concurrent: false })
                }
            },
            {
                title: "Initialize template",
                task: () => {
                    return new Promise((resolve, reject) => {
                        try {
                            createDirectoryContents(templatePath, projectName);

                            const fileName = `${getCurrentWorkingDirectory()}/${projectName}/package.json`;
                            const file = require(fileName);

                            file.name = projectName;

                            fs.writeFileSync(fileName, JSON.stringify(file));
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    })
                }
            },
            {
                title: "Initializing Packages (this may take a few moments)",
                task: () => {
                    return new Promise((resolve, reject) => {
                        try {
                            cp.exec("npm install", { cwd: projectPath }, function (error, stdout, stderr) { }).on("close", () => {
                                resolve();
                            });
                        } catch (e) {
                            reject(e);
                        }
                    });
                }
            }
        ], {
            exitOnError: true
        });

        tasks.run()
            .then(_ => {
                console.log("Success! To get started type " + chalk.blueBright(`cd ${projectName} && npm start`));
            })
            .catch(err => {
                console.error(err);
            });
    };

    if (fs.existsSync(projectPath)) {
        const replacementChoices = ['No', 'Yes'];
        const replacementQuestions = [{
            name: 'replace-existing-directory',
            type: 'list',
            message: `${projectPath} already exists. Would you like to replace it?`,
            choices: replacementChoices
        }];


        inquirer.prompt(replacementQuestions)
            .then(answers => {
                if (answers['replace-existing-directory'] === "Yes") {
                    performCreate(true);
                } else {
                    console.log(chalk.red('Unable to continue due to project name conflict.'));
                }
            });
    } else {
        performCreate();
    }
}

function createDirectoryContents(templatePath, newProjectPath) {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`;

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8');

            const writePath = `${getCurrentWorkingDirectory()}/${newProjectPath}/${file}`;
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            fs.mkdirSync(`${getCurrentWorkingDirectory()}/${newProjectPath}/${file}`);

            // recursive call
            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        }
    });
}