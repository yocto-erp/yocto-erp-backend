import { getCIDIpfsStatus, uploadToIPFSFiles } from "../../app/service/file/ipfs.service";
import { cronJobUpdateIPFSStatus, cronJobUploadIPFS } from "../../app/service/asset/cloud.service";

describe("File Test Suite", () => {
  it("checkFileExisted", async function getCurrentHourTest() {
    const listAssets = [
      "0233291c-6192-4a5f-87bd-ada77656f3b1", "652c193f-61d4-4a12-90c3-6eb19100b470",
      "bf3e43ee-187f-42fe-8f05-adefa78dca6c", "e4cdf477-15ec-40b6-93f6-8388450703b9", "0233291c-6192-4a5f-87bd-"
    ];
    console.log(await uploadToIPFSFiles(listAssets));
  });
  it("uploadIPFSFile", async function cronUpload() {
    await cronJobUploadIPFS();
  });
  it("get IPFS CID Status", async () => {
    const rs = await getCIDIpfsStatus("bafybeias6gpgqc2r6lw6e5hracw2g3vi4xexmyuf7nsu3bkjxiulpcnzpy");
    console.log("Total Pin: ", rs.pins.filter(t => t.status === "Pinned").length);
    console.log("Total Unpinned: ", rs.pins.filter(t => t.status === "Unpinned").length);
    console.log("Total PinQueued: ", rs.pins.filter(t => t.status === "PinQueued").length);
  });
  it("update status", async () => {
    await cronJobUpdateIPFSStatus();
  });
});
