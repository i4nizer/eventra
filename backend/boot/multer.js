import fs from "fs/promises"

//

const run = async () => {
    // --- Check
    const dir = `${process.cwd()}/uploads/photo`
    const exists = await fs.access(dir).then(() => true).catch(() => false)
    if (!exists) await fs.mkdir(dir, { recursive: true })
    console.info("Boot, multer dir checked.")
}

//

export default { run }
