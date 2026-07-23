const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1>Welcome to dev tinder</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "Welcome",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Namaste Dev",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "friendkaushal98@gmail.com",
    "kaushal30061997@gmail.com",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    console.log(caught, "caught");

    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
// export { run };
module.exports = { run };
