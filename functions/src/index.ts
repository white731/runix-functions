import * as functions from "firebase-functions";
import admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

const test = require("./test");
const postLead = require("./newLead");
const airtableEmailSend = require("./airtableEmailSend");

exports.test = test.test;
exports.postLead = postLead.postLead;
exports.getServiceQuarters = airtableEmailSend.getServiceQuarters;
exports.postSendEmail = airtableEmailSend.postSendEmail;
