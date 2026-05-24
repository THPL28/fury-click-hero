import { Router } from 'express';
import { JobController } from '@adapters/controllers/job.controller';
import { JobInspectionController } from '@adapters/controllers/job-inspection.controller';
import { WebhookViolationController } from '@adapters/controllers/webhook-violation.controller';

const routes = Router();
const jobController = new JobController();
const jobInspectionController = new JobInspectionController();
const webhookViolationController = new WebhookViolationController();

routes.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

routes.get('/jobs/:id', (req, res, next) => jobInspectionController.handle(req, res, next));
routes.post('/jobs', (req, res, next) => jobController.handle(req, res, next));
routes.post('/violations', (req, res, next) => webhookViolationController.handle(req, res, next));

export { routes };
