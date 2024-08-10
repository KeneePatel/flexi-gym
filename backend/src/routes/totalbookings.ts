import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/database';

const router = Router();

router.get('/:id', async (req, res) => {
    try {
      const db = getDB();
      const gym = await db.collection('userprofiles').findOne({ _id: new ObjectId(req.params.id) });

      if (!gym) {
        const gym1 = await db.collection('gyms').findOne({ _id: new ObjectId(req.params.id) });
        if(!gym1)
        {
          return res.status(404).json({ message: 'Cannot find gym' });
  
        }
      }

      const total = await db.collection('bookings').find({ gymId: req.params.id,
        status: "succeeded"}).toArray();


      res.json(total.length);

      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

export default router;
