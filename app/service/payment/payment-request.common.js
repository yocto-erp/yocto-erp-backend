export const getPaymentRequestPublicURL = (paymentRequest) => {
  return `${process.env.PUBLIC_URL || 'https://app.yoctoerp.com'}/cpm/pg/${paymentRequest.publicId}`;
};

