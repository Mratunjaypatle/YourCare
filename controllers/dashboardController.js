const Member = require('../models/Member');
const Payment = require('../models/Payment');


const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    // Ensure we have a valid start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Basic Counts (These rarely fail)
    const totalMembers = await Member.countDocuments() || 0;
    const activeMembers = await Member.countDocuments({ membershipStatus: 'active' }) || 0;
    const expiredMembers = await Member.countDocuments({ membershipStatus: 'expired' }) || 0;
    const newMembersThisMonth = await Member.countDocuments({ createdAt: { $gte: startOfMonth } }) || 0;

    // 2. Revenue Aggregation (With explicit error handling)
    const totalRevAgg = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const monthRevAgg = await Payment.aggregate([
      { $match: { status: 'completed', paymentDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // 3. Populate Handling
    // If no payments exist, this returns [], which is safe.
    const recentPayments = await Payment.find({ status: 'completed' })
      .populate('member', 'name')
      .sort({ paymentDate: -1 })
      .limit(5) || [];

    const membersByGender = await Member.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
    ]) || [];

    // 4. Monthly Revenue (Simplified Date Logic)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          paymentDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' },
          },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]) || [];

    // 5. Final Response
    res.json({
      stats: {
        totalMembers,
        activeMembers,
        expiredMembers,
        newMembersThisMonth,
        totalRevenue: totalRevAgg.length > 0 ? totalRevAgg[0].total : 0,
        revenueThisMonth: monthRevAgg.length > 0 ? monthRevAgg[0].total : 0,
        expiringThisWeek: 0, // Simplified for now to prevent date math crashes
      },
      recentPayments,
      membersByGender,
      monthlyRevenue,
    });

  } catch (error) {
    // THIS IS CRITICAL: Check your terminal/console for this output!
    console.error("DASHBOARD CONTROLLER ERROR:", error);
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};
module.exports = { getDashboardStats };
