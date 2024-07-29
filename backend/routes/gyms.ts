import { Router } from 'express';
import { getDB } from '../config/db';
import { ObjectId } from 'mongodb';

const router = Router();

// Get all gyms
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const gyms = await db.collection('gyms').find().toArray();
    res.json(gyms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a gym
router.post('/', async (req, res) => {
  const gym = {
    name: req.body.name,
    location: req.body.location,
    amenities: req.body.amenities,
  };

  try {
    const db = getDB();
    const result = await db.collection('gyms').insertOne(gym);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a gym by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const gym = await db.collection('gyms').findOne({ _id: new ObjectId(req.params.id) });
    if (!gym) {
      return res.status(404).json({ message: 'Cannot find gym' });
    }
    res.json(gym);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a gym
router.patch('/:id', async (req, res) => {
  try {
    const db = getDB();
    const gym = await db.collection('gyms').findOne({ _id: new ObjectId(req.params.id) });
    if (!gym) {
      return res.status(404).json({ message: 'Cannot find gym' });
    }

    const updatedGym = {
      ...gym,
      ...req.body,
    };

    await db.collection('gyms').updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedGym });
    res.json(updatedGym);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a gym
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('gyms').deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) {
      return res.status(404).json({ message: 'Cannot find gym' });
    }
    res.json({ message: 'Deleted Gym' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
