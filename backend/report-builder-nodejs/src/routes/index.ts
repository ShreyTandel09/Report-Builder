import express, { Router } from 'express';
import reportRoute from './report-bulider';
import tableRoute from './table-bulider';

const router = Router();

router.use('/report', reportRoute);
router.use('/table', tableRoute);


export default router;
