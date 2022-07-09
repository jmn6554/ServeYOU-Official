const functions = require('firebase-functions');
// eslint-disable-next-line max-len
const stripe = require('stripe')('sk_test_51KzOvYCZFYQ4Ujzx0SQkO2rTiqQecgiKRxBe8vRFE4S3Qv8k4gMLQRQ3UYZoptjB7SLs7KZMUApyYRRH3vuOQ0qo00H1D19qGm');

exports.productPriceUpdate= functions.https.onCall(
    async (productID, priceID, newName, newPrice) => {
      console.log(product);
      const product = await stripe.products.update(
          productID,
          {name: newName},
      );

      const price = await stripe.prices.update(
          priceID,
          {unit_amount: newPrice,
            currency: 'cad',
            product: productID},
      );

      return ({
        updatedProduct: product,
        updatedPrice: price,
      });
    },

);
