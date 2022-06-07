import 'regenerator-runtime/runtime';

let near;
let contract;
let accountId;
let secondAccountId;

beforeAll(async function () {
  near = await nearlib.connect(nearConfig);
  accountId = nearConfig.contractName;
  contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['getAccountsByCommentId', 'getAll'],
    changeMethods: ['addLike', 'removeLike', 'clearAll'],
    sender: accountId,
  });
  secondAccountId = nearConfig.contractName;
});

it('adds like', async () => {
  await contract.addLike({ commentId: '1212' });
  const accountsByCommentd = await contract.getAccountsByCommentId({ commentId: '1212' });
  expect(accountsByCommentd).toMatchObject([accountId]);
});

it('adds two likes', async () => {
  await contract.addLike({ commentId: '1212' });
  await contract.addLike({ commentId: '121233' });
  const allLikes = await contract.getAll();
  expect(allLikes).toMatchObject([
    { key: '1212', value: [accountId] },
    { key: '121233', value: [accountId] }]
  );
});

it('removes likes', async () => {
  await contract.addLike({ commentId: '1212' });
  await contract.removeLike({ commentId: '1212' });
  const accountsByCommentd = await contract.getAccountsByCommentId({ commentId: '1212' });
  expect(accountsByCommentd).toMatchObject([]);
});

it('clears all', async () => {
  await contract.addLike({ commentId: '1212' });
  await contract.addLike({ commentId: '121233' });
  await contract.clearAll();
  const accountsByCommentd1 = await contract.getAccountsByCommentId({ commentId: '1212' });
  const accountsByCommentd2 = await contract.getAccountsByCommentId({ commentId: '121233' });
  expect(accountsByCommentd1).toMatchObject([]);
  expect(accountsByCommentd2).toMatchObject([]);
});
