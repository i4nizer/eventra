import tasks from "../tasks/index.js"

//

const run = async () => {
    // --- Start
    await tasks.run()
    console.info(`Boot, tasks running in the background.`)
}

//

export default { run }
