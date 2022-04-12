import { formatNumberDB, fromBigNumberJson } from "../../app/util/math.util";

describe("Math Test", () => {
  it("test format form JSON", async function testImage() {
    console.log(fromBigNumberJson({
      mathjs: "BigNumber",
      value: "398472938472394"
    }));
  });
  it("format to db", async function testImage() {
    const test = fromBigNumberJson({
      mathjs: "BigNumber",
      value: "398472938472394.93224732984739874"
    })
    console.log(formatNumberDB(test));
  });
});
