const cron = require('node-cron');
const userModel = require('./models/userModel');

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Running auto-deactivation cron job');
        const now = new Date();
        const users = await userModel.find({ isActive: true, activeUntil: { $lte: now } });
        for (const user of users) {
            user.isActive = false;
            user.activeUntil = null;
            await user.save();
            console.log(`Deactivated user: ${user.email}`);
        }
    } catch (error) {
        console.error('Cron job error:', error.message);
    }
});
