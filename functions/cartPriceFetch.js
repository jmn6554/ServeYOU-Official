
const functions = require('firebase-functions');
const admin = require('firebase-admin');
// eslint-disable-next-line max-len
// const stripe = require('stripe')('sk_test_51KzOvYCZFYQ4Ujzx0SQkO2rTiqQecgiKRxBe8vRFE4S3Qv8k4gMLQRQ3UYZoptjB7SLs7KZMUApyYRRH3vuOQ0qo00H1D19qGm');
// admin.initializeApp();

exports.cartPriceFetch = functions.https.onCall(
    async (user) => {
      const subTotal = [];
      let sum = 0;
      await admin.firestore().collection('Cart').get().then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().user == user) {
            console.log(2);
            subTotal.push(doc.data().subTotal);
          }
        });
        subTotal.forEach((e) => {
          sum = e + sum;
        });
      },
      );
      return subTotal;
    },
);

