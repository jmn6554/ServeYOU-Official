const functions = require('firebase-functions');
// eslint-disable-next-line max-len
const stripe = require('stripe')('sk_test_51KzOvYCZFYQ4Ujzx0SQkO2rTiqQecgiKRxBe8vRFE4S3Qv8k4gMLQRQ3UYZoptjB7SLs7KZMUApyYRRH3vuOQ0qo00H1D19qGm');

exports.paymentSheet = functions.https.onCall(
    async (price) => {
      const customer = await stripe.customers.create();
      const ephemeralKey = await stripe.ephemeralKeys.create(
          {customer: customer.id},
          {apiVersion: '2020-08-27'},
      );
      console.log(price);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price * 100,
        currency: 'cad',
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        },
        // off_session: true,
        // confirm: true,
      });

      const paymentMethods = await stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
      });

      return ({
        clientSecret: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        paymentMethods: paymentMethods.id,
        // eslint-disable-next-line max-len
        publishableKey: 'pk_test_51KzOvYCZFYQ4UjzxqG53MvL2ZBlkpykcGlvkbPt2PJvWBvvl8zfm8up8wMVJgFv2JipKWFDXKbrbnMFvKXR5dXRt00cXlIxVjT',
      });
    },

);
