const functions = require('firebase-functions');
const admin = require('firebase-admin');
// eslint-disable-next-line max-len
const stripe = require('stripe')('sk_test_51KzOvYCZFYQ4Ujzx0SQkO2rTiqQecgiKRxBe8vRFE4S3Qv8k4gMLQRQ3UYZoptjB7SLs7KZMUApyYRRH3vuOQ0qo00H1D19qGm');

exports.paymentSheetReturningCustomer = functions.https.onCall(
    async (data) => {
      console.log(data.user);
      let customerID = '';
      await admin.firestore().collection('Users').get().then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().userID == data.user) {
            customerID = doc.data().customerID;
            console.log(1);
          }
        });
      },
      );

      console.log('customerID: ' + JSON.stringify(customerID));

      const paymentIntent = await stripe.paymentIntents.create({
        amount: data.price * 100,
        currency: 'cad',
        customer: customerID,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return ({
        clientSecret: paymentIntent.client_secret,
        customer: customerID,
        // eslint-disable-next-line max-len
        publishableKey: 'pk_test_51KzOvYCZFYQ4UjzxqG53MvL2ZBlkpykcGlvkbPt2PJvWBvvl8zfm8up8wMVJgFv2JipKWFDXKbrbnMFvKXR5dXRt00cXlIxVjT',
      });
    },

);
