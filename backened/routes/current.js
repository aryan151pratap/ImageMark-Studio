const express = require("express")
const multer = require("multer")
const User = require("../models/user")

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.put("/update/:email", upload.single("file"), async (req, res) => {
  try {
    const updateData = {}
    if (req.file) {
		const base64Image = req.file.buffer.toString("base64");
      updateData.image = `data:${req.file.mimetype};base64,${base64Image}`;
      updateData.filename = req.file.originalname
      updateData.contentType = req.file.mimetype
      updateData.labels = []
    }
    if (req.body.labels) {
      try {
        updateData.labels = req.body.labels;
      } catch {
        return res.status(400).json({ error: "Invalid labels format" })
      }
    }

	if (req.body.folder) {
		try {
			updateData.folder = req.body.folder;
		} catch {
			return res.status(400).json({ error: "Invalid labels format" })
		}
	}

	if (req.body.clearImage === true || req.body.clearImage === "true") {
      updateData.image = null;
      updateData.filename = null;
      updateData.contentType = null;
    }

    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: updateData },
      { new: true }
    )

    if (!user) return res.status(404).json({ error: "User not found" })

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        filename: user.filename,
        labels: user.labels
      }
    })
  } catch (error) {
    res.status(500).json({ error: "Error updating user data" })
  }
})

router.get("/image/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('image filename contentType folder labels')
    if (!user || !user.image) return res.status(404).send("Image not found");

    res.status(200).json({
      data : {
        image: user.image,
        filename: user.filename,
        folder: user.folder,
        labels: user.labels
      }
    })
  } catch {
    res.status(404).send("Image not found")
  }
})

module.exports = router
