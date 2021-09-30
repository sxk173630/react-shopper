//Format currency for Stripe. Everything is converted x10 beacuse its in dollars.
import { formatCurrencyString } from "use-shopping-cart";
//Function accepts an entire product with all its data, and then returns its appropriate price.  
export default function formatProductPrice(product) {
    //FormatCurrencyString takes an object with 3 properties.
    //In this case the object comes from the products.json file.
    return formatCurrencyString({
        value: product.price,
        currency: product.currency,
        language: navigator.language
    });
}
