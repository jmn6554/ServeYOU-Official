
const functions = require('firebase-functions');
const admin = require('firebase-admin');
// eslint-disable-next-line max-len
const stripe = require('stripe')('sk_test_51KzOvYCZFYQ4Ujzx0SQkO2rTiqQecgiKRxBe8vRFE4S3Qv8k4gMLQRQ3UYZoptjB7SLs7KZMUApyYRRH3vuOQ0qo00H1D19qGm');
const cartPriceFetch = require('./cartPriceFetch');
const paymentSheet = require('./paymentSheetTest');
const quoteCreation = require('./quoteCreation');
const quoteRetrieval = require('./quoteRetrieval');
const quoteFinalized = require('./quoteFinalized');
const priceCreation = require('./priceCreation');
const priceDeletion = require('./priceDeletion');
const customerCreation = require('./customerCreation');
const productPriceUpdate = require('./productPriceUpdate');
// eslint-disable-next-line max-len
const paymentSheetReturningCustomer = require('./paymentSheetReturningCustomer');

exports.cartPriceFetch = cartPriceFetch.cartPriceFetch;
exports.paymentSheet = paymentSheet.paymentSheet;
exports.quoteCreation = quoteCreation.quoteCreation;
exports.quoteRetrieval = quoteRetrieval.quoteRetrieval;
exports.priceCreation = priceCreation.priceCreation;
exports.customerCreation = customerCreation.customerCreation;
exports.productPriceUpdate = productPriceUpdate.productPriceUpdate;
exports.quoteFinalized = quoteFinalized.quoteFinalized;
// eslint-disable-next-line max-len
exports.paymentSheetReturningCustomer = paymentSheetReturningCustomer.paymentSheetReturningCustomer;
exports.priceDeletion = priceDeletion.priceDeletion;
admin.initializeApp();

exports.completePaymentWithStripe = functions.https.onCall(
    async (price) => {
      console.log(price);
      //   const ephemeralKey = await stripe.ephemeralKeys.create(
      //       {customer: customer.id},
      //       {apiVersion: '2020-08-27'},
      //   );
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price * 100,
        currency: 'cad',
      });
      console.log(4);
      return ({
        clientSecret: paymentIntent.client_secret,
        // ephemeralKey: ephemeralKey.secret,
        // customer: customer.id,
        // eslint-disable-next-line max-len
        publishableKey: 'pk_test_51KzOvYCZFYQ4UjzxqG53MvL2ZBlkpykcGlvkbPt2PJvWBvvl8zfm8up8wMVJgFv2JipKWFDXKbrbnMFvKXR5dXRt00cXlIxVjT',
      });
    },

);
