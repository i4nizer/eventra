import path from "path"
import multer from "multer"

//

const filter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"]
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error("Only image files are allowed."), false)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, `${process.cwd()}/uploads/photo/`),
    filename: (req, file, cb) => cb(null, `${file.originalname}.${Date.now()}${path.parse(file.originalname).ext}`),
})

//

export default multer({ storage, fileFilter: filter, limits: { fileSize: 5 * 1024 * 1024 } })
