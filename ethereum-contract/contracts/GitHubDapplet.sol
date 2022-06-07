//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract GitHubDapplet {
    struct CommentInfo {
        string commentId;
        address[] accounts;
    }
    string[] private _commentIds;
    mapping(string => address[]) private _accountsByCommentId;

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

    function addLike(string memory commentId) public {
        bool a;
        for(uint i; i < _accountsByCommentId[commentId].length; ++i) {
            if (_accountsByCommentId[commentId][i] == msg.sender) {
                a = true;
            }
        }
        require(!a, "You are already liked this comment!");
        _accountsByCommentId[commentId].push(msg.sender);
        _commentIds.push(commentId);
    }

    function removeLike(string memory commentId) public {
        address[] memory likes = new address[](_accountsByCommentId[commentId].length - 1);
        uint j;
        for(uint i; i < _accountsByCommentId[commentId].length; i++) {
            if (_accountsByCommentId[commentId][i] != msg.sender) {
                likes[j++] = _accountsByCommentId[commentId][i];
            }
        }
        _accountsByCommentId[commentId] = likes;
        if (_accountsByCommentId[commentId].length == 0) {
            string[] memory newCommentIds = new string[](_commentIds.length - 1);
            uint k;
            for(uint i; i < _commentIds.length; i++) {
                if (keccak256(bytes(_commentIds[i])) != keccak256(bytes(commentId))) {
                    newCommentIds[k++] = _commentIds[i];
                }
            }
            _commentIds = newCommentIds;
        }
    }
}
