import React, { useState } from "react";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const PaymentComponent = ({ setIsPaying }) => {
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    console.log("HANDLE");
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`, // Keep this as fallback
      },
      redirect: "if_required", // Add this line
    });

    if (error) {
      setMessage(error.message);
    } else {
      setIsPaying(false);

      // call book status update api
    }
  };

  return (
    <div>
      <form onSubmit={handlePayment}>
        <PaymentElement />
        <button disabled={isLoading || !stripe || !elements}>
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
        {message && <div>{message}</div>}
      </form>{" "}
    </div>
  );
};

export default PaymentComponent;
