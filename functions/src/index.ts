import * as functions from "firebase-functions";
import admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);
// import twilio from "twilio";
import {getFirestore} from "firebase-admin/firestore";
const nodemailer = require('nodemailer');

const firestore = getFirestore();

const cors = require('cors')({
  origin: true,
});

//Create a User aka, store their name and phone number. 

export const postLead = functions.https.onRequest((req: any, resp: any) => {

  cors(req, resp,()=>{
    let name = req.body.name
    let phone = req.body.phone
    let email = req.body.email
    let city = req.body.city
    let state = req.body.state

    userExists(email).then(leadExists => {
      console.log("LeadExists: ", leadExists)
      // check if this user exists. 

      if(leadExists){
        resp.send("Sorry, it looks like this user has already requested an appointment, please give us a call instead.")
        resp.end()
      } else {
        const data = {
          name:name, phone:phone, email:email, city:city, state:state
        };
        console.log(data)
        sendMail(email)
        createUser(data).then(result =>{
          console.log(result)
            resp.send("We've received your inquiry. Someone will be in touch with you shortly.")
            resp.end()
        })
        .catch(error => {
          console.log(error)
          resp.send("Sorry, there has been and error. Please try again later.")
          resp.end()
        })
      }
    })
    .catch(error => {
      console.log(error)

    })

  })
    
})

const userExists = async (documentId: string) => {

  const userRef = firestore.collection("leads").doc(documentId)
  const doc = await userRef.get()
  if (doc.exists){
    return true
  }
  return false

}

const createUser = async (data: {name: string, phone: string, email: string, city: string, state: string}) => {

  // Add a new document in collection "users" with the phoneNumber as the ID
  await firestore.collection('leads').doc(data.email).set(data)

  console.log(data)
  
  return "Request was successful."
}


/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: functions.config().gmail.email,
      pass: functions.config().gmail.password
  }
});

const sendMail = (destination) => {
      // getting dest email by query string
      const dest = destination

      const mailOptions = {
          from: destination, // Something like: Jane Doe <janedoe@gmail.com>
          to: dest,
          subject: 'I\'M A PICKLE!!!', // email subject
          html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
              <br />
              <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
          ` // email content in HTML
      };

      // returning result
      return transporter.sendMail(mailOptions, (erro, info) => {
          if(erro){
              console.log(erro.toString())
              return erro.toString();
          }
          console.log('Sent')
          return 'Sent'
      });
  };  