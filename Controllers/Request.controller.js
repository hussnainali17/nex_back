const CollabRequest = require('../Models/Request.model');
const Investor = require('../Models/Investor.model');
const Entrepreneur = require('../Models/Entrepreneur.model');

module.exports.sendRequest = async (req, res) => {
    
  const { userId, entrepreneurId } = req.body;
  const investor = await Investor.findOne({'user':userId});
  if (!investor) return res.status(404).json({ msg: 'update your Investor account by going in Profile section' });
  const investorId = investor._id; // Get the _id directly from the investor document

  try {
    // // Confirm investor exists
    // const investor = await Investor.findById(investorId);
    // if (!investor) return res.status(404).json({ msg: 'Investor not found' });

    // // Confirm entrepreneur exists
    // const entrepreneur = await Entrepreneur.findById(entrepreneurId);
    // if (!entrepreneur) return res.status(404).json({ msg: 'Entrepreneur not found' });

    // Check for duplicate request
    const existing = await CollabRequest.findOne({ investorId: investorId, entrepreneurId: entrepreneurId });
    if (existing) return res.status(400).json({ msg: 'Request already sent' });

    // Create new request

    const request = new CollabRequest({ investorId: investorId, entrepreneurId: entrepreneurId });
    await request.save();

    res.status(201).json({ msg: 'Request sent', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports.getRequestsForEntrepreneur = async (req, res) => {
  const { entrepreneurId } = req.params;
// this entrepreneurId is the userId of the entrepreneur
  const entrepreneur = await Entrepreneur.findOne({'user': entrepreneurId });
  

  try {
    //const requests = await CollabRequest.find({ entrepreneurId }).populate('investorId');
   const requests = await CollabRequest.find({ entrepreneurId: entrepreneur._id })
      .populate({
        path: 'investorId',
        populate: {
          path: 'user',
          model: 'User',
          populate: {
            path: 'profile',
            model: 'investor' // Because the user's role is 'investor'
          }
        }
      });

    // console.log('Requests:', requests);
    res.json(requests);
  } catch (err) {
    
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const updated = await CollabRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: 'Request not found' });

    res.json({ msg: 'Status updated', updated });
  } catch (err) {
    
    res.status(500).json({ msg: 'Server Error' });
  }
};




module.exports.getSentRequests = async (req, res) => {
  const { userId } = req.params; // userId is the investor's user ID
  const investor = await Investor.findOne({ 'user': userId });
  if (!investor) return res.status(404).json({ msg: 'update your Investor account by going in Profile section' });
  const investorId = investor._id;

  try {
    const requests = await CollabRequest.find({ investorId }).select('entrepreneurId status');
    // Optionally, map to plain objects if you want to remove _id
    const result = requests.map(r => ({
      entrepreneurId: r.entrepreneurId,
      status: r.status
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports.getCollaborators = async (req, res) => {
  const { userId } = req.params; // userId is the investor's user ID
  const entrepreneur = await Entrepreneur.findOne({'user': userId});
  if (!entrepreneur) return res.status(404).json({ msg: 'Entrepreneur not found' });
  const entrepreneurId = entrepreneur._id;

  try {
    const collaborators = await CollabRequest.find({ entrepreneurId, status: 'accepted' })
      .populate({
        path: 'investorId',
        populate: {
          path: 'user',
          model: 'User'
        }
      });


    res.json(collaborators);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};
