const Client = require('../models/Client');

const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createClient = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const client = new Client({
      user: req.user.userId,
      name,
      email,
      phone,
      company
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateClient = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { name, email, phone, company },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getClients, createClient, updateClient, deleteClient };
