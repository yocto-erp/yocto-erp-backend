export const register = async (user, formPublicId, formBody) => {
  const { name, email, phone, captcha, classes, products, description } = formBody;
  return { ok: 1 };
};
