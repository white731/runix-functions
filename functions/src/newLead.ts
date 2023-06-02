const { getFirestore } = require("firebase-admin/firestore");
const functionsTwo = require("firebase-functions");
const corsTwo = require("cors")({
  origin: true,
});
const firestore = getFirestore();
const nodemailer = require("nodemailer");

//Create a User aka, store their name and phone number.

exports.postLead = functionsTwo.https.onRequest((req, resp) => {
  corsTwo(req, resp, () => {
    let name = req.body.name;
    let phone = req.body.phone;
    let email = req.body.email;
    let address = req.body.address;

    userExists(email)
      .then((leadExists) => {
        console.log("LeadExists: ", leadExists);
        // check if this user exists.
        // check if this user exists.
        // check if this user exists.

        if (leadExists) {
          resp.send(
            "Sorry, it looks like this user has already requested an appointment, please give us a call instead."
          );
          resp.end();
        } else {
          const data = {
            name: name,
            phone: phone,
            email: email,
            address: address,
          };
          console.log(data);
          sendMail(data);
          createUser(data)
            .then((result) => {
              console.log(result);
              resp.send(
                "We've received your inquiry. Someone will be in touch with you shortly."
              );
              resp.end();
            })
            .catch((error) => {
              console.log(error);
              resp.send(
                "Sorry, there has been and error. Please try again later."
              );
              resp.end();
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

const userExists = async (documentId: string) => {
  const userRef = firestore.collection("leads").doc(documentId);
  const doc = await userRef.get();
  if (doc.exists) {
    return true;
  }
  return false;
};

const createUser = async (data: {
  name: string;
  phone: string;
  email: string;
  address: string;
}) => {
  // Add a new document in collection "users" with the phoneNumber as the ID
  await firestore.collection("leads").doc(data.email).set(data);

  console.log(data);

  return "Request was successful.";
};

/**
 * Here we're using Gmail to send
 * Here we're using Gmail to send
 * Here we're using Gmail to send
 */
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functionsTwo.config().gmail.email,
    pass: functionsTwo.config().gmail.password,
  },
});

const sendMail = async (data: {
  email: string;
  phone: string;
  name: string;
  address: string;
}) => {
  try {
    const from = data.email;
    const to = "landon@runixhomes.com";

    const mailOptions = {
      from: from, // Something like: Jane Doe <janedoe@gmail.com>
      to: to,
      subject: "New Lead: " + from, // email subject
      text:
        "You've received a new lead. \n" +
        "Email: " +
        data.email +
        "\n" +
        "Phone: " +
        data.phone +
        "\n" +
        "Name: " +
        data.name +
        "\n" +
        "Address: " +
        data.address +
        "\n",
    };

    console.log(mailOptions);

    // returning result
    transporter.sendMail(mailOptions);
    console.log("Email Sent");
  } catch (error) {
    console.log("error: ", error);
  }
};
