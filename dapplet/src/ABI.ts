export default [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'commentId',
        type: 'string',
      },
    ],
    name: 'addLike',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'commentId',
        type: 'string',
      },
    ],
    name: 'getAccountsByCommentId',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAll',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'commentId',
            type: 'string',
          },
          {
            internalType: 'address[]',
            name: 'accounts',
            type: 'address[]',
          },
        ],
        internalType: 'struct GitHubDapplet.CommentInfo[]',
        name: 'result',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'commentId',
        type: 'string',
      },
    ],
    name: 'removeLike',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
