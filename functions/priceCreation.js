const functions = require('firebase-functions');
// eslint-disable-next-line max-len
const stripe = require('stripe')('sk_test_51KzOvYCZFYQ4Ujzx0SQkO2rTiqQecgiKRxBe8vRFE4S3Qv8k4gMLQRQ3UYZoptjB7SLs7KZMUApyYRRH3vuOQ0qo00H1D19qGm');

exports.priceCreation = functions.https.onCall(
    async (data) => {
      console.log('price: ' + data.price);
      const product = await stripe.products.create({
        name: data.name,
      });
      console.log(product);

      const price = await stripe.prices.create({
        unit_amount: data.price,
        currency: 'cad',
        product: product.id,
      });

      return ({
        product: product,
        price: price,
      });
    },

);
