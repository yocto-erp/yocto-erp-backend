const getFormRegisterInfoPage = (publicId) => {
  return `${process.env.PUBLIC_URL}/cpm/${publicId}/register`;
};

export const toPrintData = (formRegisterInfo) => {

  const { name, ip, registerData, totalAmount, publicId } = formRegisterInfo;
  const { classes, products, ...other } = registerData;
  return {
    name, ip, url: getFormRegisterInfoPage(publicId), registerData, totalAmount, classes, products, ...other,
    form: {
      name: formRegisterInfo.form?.name || ''
    }
  };
};
