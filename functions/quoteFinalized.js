const functions = require('firebase-functions');
// eslint-disable-next-line max-len
const stripe = require('stripe')('sk_test_51KzOvYCZFYQ4Ujzx0SQkO2rTiqQecgiKRxBe8vRFE4S3Qv8k4gMLQRQ3UYZoptjB7SLs7KZMUApyYRRH3vuOQ0qo00H1D19qGm');

exports.quoteFinalized = functions.https.onCall(
    async (quoteID) => {
      const quote = await stripe.quotes.finalizeQuote(
          quoteID,
      );

      return ({
        quote: quote,
      });
    },

);
