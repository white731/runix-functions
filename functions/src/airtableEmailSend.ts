const functionsOne = require("firebase-functions");
const Airtable = require("airtable");

const corsOne = require("cors")({
  origin: true,
});

var base = new Airtable({
  apiKey:
    "patga5iuOccFYalQc.f702221a0a75e65e12e42e723fd13779981745c12308b9e1a790b97f12a8d9de",
}).base("appF7uBEuZx3CjybW");

// const getPropertyService = (serviceQuarter) => {
//   base("Service Quarters")
//     .select({
//       filterByFormula: `IF({ID}=${serviceQuarter}, 1, 0)`,
//     })
//     .all()
//     .then((record) => {
//       console.log("Retrieved", record[0].fields.FullNameOfCustomer);
//       // setSelectedServiceCustomerName(record[0].fields.FullNameOfCustomer);
//     });
// };

const getServiceQuartersFromAirtable = async () => {
  const response = await base("Service Quarters").select().all();
  console.log(response);
  return response;
};

const getRelevantServicesFromQuarter = async (serviceQuarter) => {
  let tempList = [];

  base("Services")
    .select({
      filterByFormula: `IF({ID (from Service Quarters)} = '${serviceQuarter}',1,0 )`,
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function (record) {
          tempList.push(record);
          // setServiceList(tempList);
          console.log("Retrieved", record);
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return err;
        } else {
          return tempList;
        }
      }
    );
};

// const handleSelectCustomerService = (e) => {
//   // setServiceList([]);
//   // setSelectedService(e.target.value);
//   console.log(e.target.value);
//   getRelevantServicesFromQuarter(e.target.value);
//   getPropertyService(e.target.value);
// };

// const handleSubmit = (e) => {
//   e.preventDefault();
//   // console.log(serviceList);
//   // console.log(SummaryPage(serviceList, selectedService));
// };

//end point that returns a list of all the service quarters - "GetServiceQuarters"

exports.getServiceQuarters = functionsOne.https.onRequest(
  (req: any, resp: any) => {
    corsOne(req, resp, () => {
      if (req.method === "GET") {
        // resp.status(200);
        // resp.send("It Worked");
        getServiceQuartersFromAirtable()
          .then((response) => {
            console.log(response);
            resp.send(response);
            resp.end();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        resp.status(405).send("Method no allowed");
      }
    });
  }
);

exports.postSendEmail = functionsOne.https.onRequest((req: any, resp: any) => {
  corsOne(req, resp, () => {
    let quarterName = req.quarterName;
    getRelevantServicesFromQuarter(quarterName);
  });
});

// const sendServiceSummary = async (data) => {
//   try {
//     const from = data.email;
//     const to = "landon@runixhomes.com";

//     const mailOptions = {
//       from: from, // Something like: Jane Doe <janedoe@gmail.com>
//       to: to,
//       subject: "New Lead: " + from, // email subject
//       html: "<p>Hello World</p>",
//     };

//     console.log(mailOptions);

//     // returning result
//     transporter.sendMail(mailOptions);
//     console.log("Email Sent");
//   } catch (error) {
//     console.log("error: ", error);
//   }
// };
