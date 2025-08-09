import upload from '../models/upload.js';

export const PostingLogic = async (req, res) => {
    try {
      const {
        name,
        rollno,
        gender,
        email,
        accountType,
        terms,
        fileUrl
      } = req.body;
  
      const newEntry = new upload({
        name,
        rollno,
        gender,
        email,
        accountType,
        terms,
        fileUrl
      });
  
      await newEntry.save();
  
      res.status(201).json({ message: 'Form submitted successfully ra bacha!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

export const GettingLogic = async (req, res) => {
  try {
    const data = await upload.find({});
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const PuttingLogic = async (req, res) => {
    try {
      const updated = await upload.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).send("Update failed");
    }
}

export const DeletingLogic =  async (req, res) => {
  try {
    const deletedEntry = await upload.findByIdAndDelete(req.params.id);

    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
}