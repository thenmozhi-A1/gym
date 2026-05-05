import React, { useState } from 'react';


const Pay = () => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (amount === "" || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const options = {
      key: "rzp_test_Mk659ISVbs7cZv",
      key_secret: "nrWBx585XROeY6668y4RZExa",
      amount: Number(amount) * 100, 
      currency: "INR",
      name: "Dinesh",
      description: "For testing",
      handler: function (response) {
        alert("Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Dinesh",
        email: "dinesh@gmail.com",
        contact: "1234567890",
      },
      theme: {
        color: "#3399cc",
      },
      notes: {
        address: "Razorpay",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="container">
      <h2>GYM Membership Payment</h2>
      <br />
      <input
        type="text"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Pay;
