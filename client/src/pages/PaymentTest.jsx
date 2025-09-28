const PaymentTest = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Payment Callback Test Page</h1>
      <p>If you can see this, the routing is working!</p>
      <p>URL: {window.location.href}</p>
      <p>Search params: {window.location.search}</p>
    </div>
  );
};

export default PaymentTest;