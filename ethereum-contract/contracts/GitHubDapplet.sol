//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract GitHubDapplet {

    struct CommentInfo {
        string commentId;
        address[] accounts;
    }

    string[] private _commentIds;
    mapping(string => address[]) private _accountsByCommentId;
    mapping(address => mapping(string => bool)) private _isVotedFor;
    mapping(string => bool) private _isAlreadyAdded;

    function getAccountsByCommentId(string memory commentId)
        public
        view
        returns (address[] memory)
    {
        return _accountsByCommentId[commentId];
    }

    function getAll() public view returns (CommentInfo[] memory result) {
        result = new CommentInfo[](_commentIds.length);

        for(uint i; i < _commentIds.length; i++) {
            CommentInfo memory cI = CommentInfo(
                _commentIds[i],
                _accountsByCommentId[_commentIds[i]]
            );
            result[i] = cI;
        }

        return result;
    }
    

    function addLike(string memory commentId) external {
        require( 
            !_isVotedFor[msg.sender][commentId],
            "You already liked this comment!"
            );
        
        if(!_isAlreadyAdded[commentId]) {
            _commentIds.push(commentId);
            _isAlreadyAdded[commentId] = true;
        }

        _isVotedFor[msg.sender][commentId] = true;
        _accountsByCommentId[commentId].push(msg.sender);
    }


    function removeLike(string memory commentId) external {
        address[] memory likes =
            new address[](_accountsByCommentId[commentId].length - 1);
        uint j;

        for(uint i; i < _accountsByCommentId[commentId].length; i++) {
            if (_accountsByCommentId[commentId][i] != msg.sender) {
                likes[j++] = _accountsByCommentId[commentId][i];
            }
        }

        _accountsByCommentId[commentId] = likes;

        if (_accountsByCommentId[commentId].length == 0) {
            string[] memory newCommentIds =
                new string[](_commentIds.length - 1);
            bytes32 currentCommentId = keccak256(bytes(commentId));
            uint k;

            for(uint i; i < _commentIds.length; i++) {
                if (keccak256(bytes(_commentIds[i])) != currentCommentId) {
                    newCommentIds[k++] = _commentIds[i];
                }
            }

            _isAlreadyAdded[commentId] = false;
            _commentIds = newCommentIds;
        }
    }
}
