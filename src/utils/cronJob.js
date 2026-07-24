const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { endOfDay, startOfDay, subDays } = require("date-fns");
const sendEmail = require("../utils/sendEmail");
cron.schedule("* * * * *", async () => {
  try {
    // console.log("listOfEmails");

    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const connectionRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("toUserId fromUserId");
    const listOfEmails = [
      ...new Set(connectionRequests.map((req) => req.toUserId.email)),
    ];
    console.log(listOfEmails, "listOfEmails");
    for (const email of listOfEmails) {
        const res = await sendEmail.run();
        console.log(res,"response")
    }
  } catch (error) {
    //
  }
});
