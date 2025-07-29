const express = require('express');
const mongoose = require('mongoose');
const archiver = require('archiver');
const router = express.Router();
const Label = require('../models/label');
const User = require('../models/user');

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

router.get('/download/:folder/:email', async (req, res) => {
  const { folder, email } = req.params;

  try {
    const user = await User.findOne({ email }).select('_id');
    if (!user) return res.status(404).send('Uer not found');

    const data = await Label.findOne({ userId: user._id, folder });
    if (!data) return res.status(404).send('Folder not found');

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${folder}_annotations.zip`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    const allLabels = handle_label(data);

    for (const file of data.files) {
      const { filename, labels, img_width, img_height } = file;

      if (!img_width || !img_height) continue; // Skip if dimensions are missing

      const content = (labels || []).map(l => {
        
        const classId = allLabels.indexOf(l.label);

        const x_center = ((l.x + l.width / 2) / img_width).toFixed(6);
        const y_center = ((l.y + l.height / 2) / img_height).toFixed(6);
        const width = (l.width / img_width).toFixed(6);
        const height = (l.height / img_height).toFixed(6);

        return `${classId} ${x_center} ${y_center} ${width} ${height}`;
      }).join('\n');

      const cleanName = filename.replace(/\.[^/.]+$/, "") + ".txt";
      archive.append(content, { name: cleanName });
    }

    await archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error downloading annotations');
  }
});


router.get('/labels/:folder/:email', async (req, res) => {
  try{
    const { folder, email } = req.params;
    console.log(folder, email);

    const user = await User.findOne({ email }).select('_id');
    if (!user) return res.status(404).send('Uer not found');

    const data = await Label.findOne({ userId: user._id, folder });
    if (!data) return res.status(404).send('Folder not found');

    const allLabels = handle_label(data);
    

    res.json({ success: true, labels: allLabels });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error downloading annotations');
  }
})

module.exports = router;
