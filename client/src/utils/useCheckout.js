import axios from "axios";
import toast from "react-hot-toast";
import { useShoppingCart } from "use-shopping-cart";

//Uses useShoppingCart hook to use redirectToCart function as well as cartDetails.
export default function useCheckout() {
    const {redirectToCheckout, cartDetails} = useShoppingCart();
    //Handles the check out by making a request to our API with all of the cart details. A request to the endpoint "/checkout-sessions"
    //In order to get an ID to be able to redirect to check out from this Check-Out session, async await syntax is used. 
    //By prepending handleCheckout with async and awaiting the results of this promise, we are allowed to get the data returned from a variable called "session".
   async function handleCheckout() {
       const session = await axios.post("/api/checkout-sessions", cartDetails)
            .then(res => res.data)
            //Error handling using toast
            .catch(error => {
                toast.error("Checkout Failed!");
                console.log("Error during checkout: ", error);
            });

        if(session){
            redirectToCheckout({ sessionId: session.id});
        }
    }

    return handleCheckout;
}