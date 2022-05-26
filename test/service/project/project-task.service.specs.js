import { getNextProjectTaskId } from "../../../app/service/project/project-task.service";

describe("project-task", () => {
  it("getNextProjectNextId", async function getNextProjectNextId() {
    console.log(await getNextProjectTaskId(1, 2));
  });
});
