import {getVotes, sign} from "../../../app/service/ethereum/vote-manager.service";


describe('VoteManager Contract Test', () => {
  it('vote', async function vote() {
    console.log(await sign('test 1', 'fingering 1'));
  });

  it('getVotes', async function vote() {
    console.log(await getVotes(0, 5));
  });
});
