import {sendMessage} from "../../../app/service/partner/telegram";

describe('Telegram', () => {
  it('Send Message', async function sendMessageTest() {
    console.log(await sendMessage(new Error('tessting error').stack))
  });
});
