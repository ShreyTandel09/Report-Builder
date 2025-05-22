import express, { Router } from 'express';
import reportRoute from './report-bulider'; 

const router = Router();

router.use('/report', reportRoute);

export default router;
