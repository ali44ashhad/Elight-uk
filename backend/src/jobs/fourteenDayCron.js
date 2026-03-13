import cron from 'node-cron';
import { Deal } from '../models/Deal.js';

/**
 * 14-day automation:
 * Every hour, find deals that are under_offer and past rejectBy:
 * set refundEligible = false (refund button becomes inactive).
 */
function runFourteenDayCron() {
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const deals = await Deal.find({
        status: 'under_offer',
        refundEligible: true,
        rejectBy: { $lt: now },
      });
      for (const d of deals) {
        await Deal.findByIdAndUpdate(d._id, { refundEligible: false }, { runValidators: true });
        console.log(`[14-day cron] Deal ${d._id} past 14-day window; refund inactive.`);
      }
    } catch (e) {
      console.error('[14-day cron]', e);
    }
  });
  console.log('14-day automation cron scheduled (hourly).');
}

export { runFourteenDayCron };
