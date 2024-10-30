import crypto from "crypto";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const StatusCheckerForQueries = (userId: string, status: string) => {
  var condition: any = {};
  if (status.toLocaleLowerCase() === "inbox") {
    condition = {
      receiverId: userId,
      dateReceived: {
        not: null,
      },
    };
  } else if (status.toLocaleLowerCase() === "incoming") {
    condition = {
      receiverId: userId,
      dateReceived: null
    };
  } else if (status.toLocaleLowerCase() === "archived") {
    condition = {
      status: {
        equals: status,
      },
    };
  } else {
    condition = {
      status: {
        not: "ARCHIVED",
      },
    };
  }
  return condition;
}

export{
  generateFileName,
  StatusCheckerForQueries,
}