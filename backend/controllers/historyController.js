const History = require('../models/History');


// Save detection history
exports.saveHistory = async (req, res) => {
  try {
    const { image, prediction, treatmentInfo } = req.body;
    const userId = req.user._id;


    const history = new History({
      userId,
      image,
      prediction,
      treatmentInfo
    });


    await history.save();
    res.status(201).json({ message: 'History saved successfully', history });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ message: 'Failed to save history' });
  }
};


// Get user's history
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;


    const history = await History.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);


    const total = await History.countDocuments({ userId });


    res.status(200).json({
      history,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};


// Delete history entry
exports.deleteHistory = async (req, res) => {
  try {
    const { historyId } = req.params;
    const userId = req.user._id;


    const history = await History.findOne({ _id: historyId, userId });
   
    if (!history) {
      return res.status(404).json({ message: 'History entry not found' });
    }


    // Updated to use deleteOne instead of remove
    await History.deleteOne({ _id: historyId, userId });
    res.status(200).json({ message: 'History entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({ message: 'Failed to delete history' });
  }
};

