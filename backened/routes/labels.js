const Label = require('../models/label');
const User = require('../models/user');
const express = require('express');
const router = express.Router();

const handle_label = function(data){
  const seenLabels = new Set();
  const allLabels = [];

  (data.files || []).forEach(file => {
    (file.labels || []).forEach(l => {
      if (!seenLabels.has(l.label)) {
        seenLabels.add(l.label);
        allLabels.push(l.label);
      }
    });
  });

  return allLabels;
}

router.post("/folder", async (req, res) => {
  try {
    const { userId, folder, filename, imgHeight, imgWidth, labels } = req.body;

    if (!userId || !folder) {
      return res.status(400).json({ error: "Missing userId or folder" });
    }

    const user = await User.findOne({ email: userId }).select('_id');
    if (!user) return res.status(404).json({ error: "User not found" });

    let folderDoc = await Label.findOne({ userId: user._id, folder });

    if (folderDoc) {
      if (filename && Array.isArray(labels)) {
        const fileIndex = folderDoc.files.findIndex(f => f.filename === filename);
        if (fileIndex !== -1) {
          folderDoc.files[fileIndex].labels = labels;
          folderDoc.files[fileIndex].img_height = imgHeight;
          folderDoc.files[fileIndex].img_width = imgWidth;
        } else {
          folderDoc.files.push({ filename, img_height: imgHeight, img_width: imgWidth, labels });
        }
      }
      await folderDoc.save();
      return res.status(200).json({ message: "Folder updated", data: folderDoc });
    } else {
      const files = filename && Array.isArray(labels)
        ? [{ filename, img_height: imgHeight, img_width: imgWidth, labels }]
        : [];      
      const newDoc = new Label({
        userId: user._id,
        folder,
        files
      });
      await newDoc.save();
      return res.status(201).json({ message: "New folder created", data: newDoc });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/get_folder/:email', async (req, res) => {
  try{
    const {email} = req.params;
    const user = await User.findOne({ email }).select('_id'); 
    const folder = await Label.find({ userId: user._id }).select('folder')
    return res.status(200).json({folder}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})

router.post('/rename', async (req, res) => {
  try {
    const { email, folder, oldName } = req.body;

    if (!email || !folder || !oldName) return res.status(400).json({ error: "Missing required fields" });
    const user = await User.findOne({ email }).select('_id');

    if (!user) return res.status(404).json({ error: "User not found" });

    const exists = await Label.findOne({ userId: user._id, folder });

    if(exists) return res.status(404).json({message: 'Already folder exists'});

    const updated = await Label.findOneAndUpdate(
      { userId: user._id, folder: oldName },
      { $set: { folder } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Folder not found for rename" });
    }

    res.status(200).json({ message: "Folder renamed successfully", data: updated });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/files', async (req, res) => {
  try{
    const { email, folder } = req.body;
    if (!email || !folder) return res.status(400).json({ error: "Missing required fields" });

    const user = await User.findOne({ email }).select('_id');

    if (!user) return res.status(404).json({ error: "User not found" });

    const data = await Label.findOne({ userId: user._id, folder }).select('folder files.filename');

    res.status(200).json({ files: data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})

router.get('/file_data/:email/:folder/:filename', async (req, res) => {
  try {
    const { email, folder, filename } = req.params;
    if (!email || !folder || !filename)
      return res.status(400).json({ error: "Missing required fields" });

    const user = await User.findOne({ email }).select('_id');
    if (!user) return res.status(404).json({ error: "User not found" });

    const label = await Label.findOne({ userId: user._id, folder }).select('files');

    const all_labels = handle_label(label);
    if (!label) return res.status(404).json({ error: "Folder not found" });

    const file = label.files.find(f => f.filename === filename);
    if (!file) return res.status(404).json({ error: "File not found" });
    res.status(200).json({ file_data: file, labels: all_labels });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete('/delete/:email/:folder', async (req, res) => {
  try {
    const { email, folder } = req.params;
    console.log(email, folder);
    const user = await User.findOne({ email }).select('_id');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Label.findOneAndDelete({ userId: user._id, folder });

    res.status(200).json({ message: 'delete folder sucessdfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete('/delete_file/:email/:folder/:fileName', async (req, res) => {
  try {
    const { email, folder, fileName } = req.params;
    console.log(email, fileName);
    const user = await User.findOne({ email }).select('_id');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await Label.updateOne(
      { userId: user._id, folder },
      { $pull: { files: { filename: fileName } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    res.status(200).json({ message: "File deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/rename_file/:email/:folder/:fileName/:newName', async (req, res) => {
  try {
    const { email, folder, fileName, newName } = req.params;
    const user = await User.findOne({ email }).select('_id');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await Label.updateOne(
      { userId: user._id, folder, "files.filename": fileName },
      { $set: { "files.$.filename": newName } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "File not found or not renamed" });
    }

    res.status(200).json({ message: "File renamed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
