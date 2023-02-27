$(function () {
    initializeCommentEditor();
    setLikes();
    setFileList();
    setClipboard();
    selectComment();

    $('#update-board').on('click', () => {
        updateBoard();
    });

    $('#delete-board').on('click', () => {
        deleteBoard();
    });

    $('#comment-insert').on('click', () => {
        insertComment();
    });

    $('#likes').on('click', () => {
        likes();
    });

    $('#comment-input').on('keydown', function (e) {
        if (e.which === 13) {
            $('#comment-insert').trigger('click');
        }
    });
});

let initializeCommentEditor = function () {
    let insertComment = function (context) {
        let ui = $.summernote.ui;
        let button = ui.button({
            contents: '<i class="fa fa-child"/> Hello',
            tooltip: 'hello',
            click: function () {
                context.invoke('editor.insertText', 'hello');
            }
        });

        return button.render();
    }

    $('#comment-editor').summernote({
        lang: 'ko-KR',
        placeholder: '댓글을 입력해주세요.',
        tabsize: 2,
        height: '10vh',
        toolbar: ['insertComment', ['insertComment']],
        buttons: {
            insertComment: insertComment,
        },
        callbacks: {
            onImageUpload: function (files) {
                for (var i = files.length - 1; i >= 0; i--) {
                    uploadContentFile(files[i], this);
                }
            },
            onMediaDelete : function(url) {
                for (var i = url.length - 1; i >= 0; i--) {
                    deleteContentFile(url[i].src);
                }
            }
        }
    });
};

let setLikes = function () {
    let thumbsUp = $('<i>', {'class' : 'fa-regular fa-thumbs-up'});
    let thumbsDown = $('<i>', {'class' : 'fa-regular fa-thumbs-down'});

    if (isLiked == 0) {
        $('#likes').text(' 좋아요');
        $('#likes').prepend(thumbsUp);
    } else {
        $('#likes').text(' 좋아요 취소');
        $('#likes').prepend(thumbsDown);
    }
};

let setClipboard = function () {
    $('#copy-clipboard').attr('data-clipboard-text', window.location.href);

    let clipboard = new ClipboardJS('#copy-clipboard');

    clipboard.on('success', function (e) {
        Alert('info', '클립보드로 복사되었습니다');
    });

    clipboard.on('error', function (e) {
        Alert('error', '지원되지 않는 브라우저입니다')
    });
};

let updateBoard = function () {
    window.location.href = '/board/update/' + boardIdx;
};

let deleteBoard = function () {
    AjaxUtil.ajax('/board/delete/' + boardIdx, 'GET', null,
        function (result) {
            if (result.ret > 0) {
                Alert('info', result.message);
                window.location.href = '/board/' + menuId;
            } else {
                Alert('error', result.message);
            }
        },
        function (result) {
            Alert('error', '게시글 삭제에 실패했습니다. 시스템 관리자에게 문의하세요.');
            console.log(result);
        }
    );
};

let setFileList = function () {
    let data = {};
    data.targetIdx = boardIdx;
    data.targetType = 'board';
    data.fileType = 'attach';

    AjaxUtil.ajax('/file/select', 'POST', data,
        function (result) {
            result.forEach(file => {
                $("#file-list").append('<div><a class="text-reset text-decoration-none text-break text-truncate fw-bold" th:attr="download=' + file.orgFileName + '" th:href="/file/download/"' + file.elementid + '">'
                    + '<i class="fa-regular fa-file me-1"></i>'
                    + '<span class="fw-bold me-1">' + file.orgFileName + '</span>'
                    + '<span class="me-1">(' + convertFileSize(file.orgFileSize) + ')</span></a></div>'
                );
            });

            if (result.length > 0) {
                $('#file-list-area').removeClass('d-none').addClass('d-block');
            }
        },
        function (result) {
            Alert('error', '게시글 파일 리스트 조회에 실패하였습니다. 시스템 관리자에게 문의하세요.');
            console.log(result);
        }
    );
};

let selectComment = function () {
    AjaxUtil.ajax('/comment/select/', 'POST', boardIdx,
        function (result) {
            $('#comment-list-ul').empty();
            result.forEach(comment => {
                let currentUserId = getCurrentUser();

                if (comment.targetIdx == 0) {
                    let commentItem = $('<li>', {'class': 'list-group-item', 'id': 'comment-item-' + comment.commentIdx});
                    let commentInfo = $('<div>', {'class': 'comment-info px-1'}).appendTo(commentItem);

                    $('<i>', {'class': 'fa-solid fa-user me-1'}).appendTo(commentInfo);
                    $('<span>', {'class': 'me-2', 'text': comment.userName}).appendTo(commentInfo);

                    $('<i>', {'class': 'fa-solid fa-calendar-days me-1'}).appendTo(commentInfo);
                    if (comment.registDate == comment.updateDate) {
                        $('<span>', {'class': 'me-2', 'text': comment.registDate}).appendTo(commentInfo);
                    } else {
                        $('<span>', {'class': 'me-2', 'text': comment.updateDate + ' (수정됨)'}).appendTo(commentInfo);
                    }

                    if (currentUserId != null && currentUserId != "") {
                        let commentSetting = $('<div>', {'class': 'dropdown d-inline'}).appendTo(commentInfo);
                        $('<a>', {'class': 'btn', 'data-bs-toggle': 'dropdown', 'type': 'button'}).append($('<i>', {'class': 'fa-solid fa-ellipsis-vertical'})).appendTo(commentSetting);

                        let commentDropdown = $('<ul>', {'class': 'dropdown-menu'});
                        commentDropdown.append($('<li>').append($('<a>', {'class': 'dropdown-item', 'id': 'nested-comment', 'text': '답글 쓰기', 'onclick': 'nestedComment(' + comment.commentIdx + ')'})));

                        if (currentUserId == comment.userId) {
                            commentDropdown.append($('<li>').append($('<a>', {'class': 'dropdown-item', 'id': 'update-comment', 'text': '댓글 수정', 'onclick': 'updateComment(' + comment.commentIdx + ')'})));
                            commentDropdown.append($('<li>').append($('<a>', {'class': 'dropdown-item', 'id': 'delete-comment', 'text': '댓글 삭제', 'onclick': 'deleteComment(' + comment.commentIdx + ')'})));
                        }

                        commentDropdown.appendTo(commentSetting);
                    }

                    let commentContent = $('<div>', {'class': 'comment-content px-1'}).appendTo(commentItem);
                    let content = $('<div>', {'class': 'comment-content-text text-truncate', 'text': comment.commentContent});
                    commentContent.append(content);

                    $('#comment-list-ul').append(commentItem);
                } else {
                    let commentItem = $('<li>', {'class': 'list-group-item ps-5', 'id': 'comment-item-' + comment.commentIdx})
                    let commentInfo = $('<div>', {'class': 'comment-info px-1'}).appendTo(commentItem);

                    $('<i>', {'class': 'fa-solid fa-user me-1'}).appendTo(commentInfo);
                    $('<span>', {'class': 'me-2', 'text': comment.userName}).appendTo(commentInfo);

                    $('<i>', {'class': 'fa-solid fa-calendar-days me-1'}).appendTo(commentInfo);
                    if (comment.registDate == comment.updateDate) {
                        $('<span>', {'class': 'me-2', 'text': comment.registDate}).appendTo(commentInfo);
                    } else {
                        $('<span>', {'class': 'me-2', 'text': comment.updateDate + ' (수정됨)'}).appendTo(commentInfo);
                    }

                    if (currentUserId != null && currentUserId != "") {
                        let commentSetting = $('<div>', {'class': 'dropdown d-inline'}).appendTo(commentInfo);
                        $('<a>', {'class': 'btn', 'data-bs-toggle': 'dropdown', 'type': 'button'}).append($('<i>', {'class': 'fa-solid fa-ellipsis-vertical'})).appendTo(commentSetting);

                        let commentDropdown = $('<ul>', {'class': 'dropdown-menu'});
                        commentDropdown.append($('<li>').append($('<a>', {'class': 'dropdown-item', 'id': 'nested-comment', 'text': '답글 쓰기', 'onclick': 'nestedComment(' + comment.commentIdx + ')'})));

                        if (currentUserId == comment.userId) {
                            commentDropdown.append($('<li>').append($('<a>', {'class': 'dropdown-item', 'id': 'update-comment', 'text': '댓글 수정', 'onclick': 'updateComment(' + comment.commentIdx + ')'})));
                            commentDropdown.append($('<li>').append($('<a>', {'class': 'dropdown-item', 'id': 'delete-comment', 'text': '댓글 삭제', 'onclick': 'deleteComment(' + comment.commentIdx + ')'})));
                        }

                        commentDropdown.appendTo(commentSetting);
                    }

                    let commentContent = $('<div>', {'class': 'comment-content px-1'}).appendTo(commentItem);
                    let badge = $('<span>', {'class': 'comment-content-badge badge rounded-pill bg-dark me-1', 'text': '@' + comment.targetUserName});
                    let content = $('<span>', {'class': 'comment-content-text text-truncate', 'text': comment.commentContent});
                    commentContent.append(badge);
                    commentContent.append(content);

                    $('#comment-item-' + comment.targetIdx).after(commentItem);
                }
            });
        },
        function (result) {
            console.log(result);
        }
    );
};

let insertComment = function () {
    let data = {};
    data.boardIdx = boardIdx;
    data.commentContent = $('#comment-input').val();

    AjaxUtil.ajax('/comment/insert/', 'POST', data,
        function (result) {
            selectComment();
            $('#comment-input').val('');
        },
        function (result) {
            Alert('error', '댓글 등록에 실패하였습니다.')
            console.log(result);
        }
    );
};

let nestedComment = function (commentIdx) {
    let inputGroup = $('<div>', {'class': 'input-group'});
    let input = $('<input>', {'class': 'form-control'});
    let button = $('<button>', {'class': 'btn btn-outline-secondary', 'text': '답글 등록', 'type': 'button'});

    inputGroup.append(input);
    inputGroup.append(button);

    button.on('click', () => {
        let data = {};
        data.boardIdx = boardIdx;
        data.targetIdx = commentIdx;
        data.commentContent = input.val();

        AjaxUtil.ajax('/comment/insert', 'POST', data,
            function (result) {
                if (result.ret > 0) {
                    inputGroup.remove();
                    selectComment();
                } else {
                    Alert('error', result.message);
                    console.log(result.exception);
                }
            },
            function (result) {
                Alert('error', result.message);
                console.log(result.exception);
            }
        );

    });

    $('#comment-item-' + commentIdx).append(inputGroup);
};

let updateComment = function (commentIdx) {
    let content = $('#comment-item-' + commentIdx).find('.comment-content');

    if (content.hasClass("d-none") === false) {
        content.addClass('d-none');

        let inputGroup = $('<div>', {'class': 'input-group'});
        let input = $('<input>', {'class': 'form-control'});
        let button = $('<button>', {'class': 'btn btn-outline-secondary', 'text': '댓글 수정', 'type': 'button'});

        inputGroup.append(input);
        inputGroup.append(button);

        input.val(content.find('.comment-content-text').text());

        button.on('click', () => {
            let data = {};
            data.commentIdx = commentIdx;
            data.commentContent = input.val();

            AjaxUtil.ajax('/comment/update', 'POST', data,
                function (result) {
                    if (result.ret > 0) {
                        inputGroup.remove();
                        content.removeClass('d-none');
                        selectComment();
                    } else {
                        Alert('error', result.message);
                        console.log(result.exception);
                    }
                },
                function (result) {
                    Alert('error', result.message);
                    console.log(result.exception);
                }
            );
        });

        $('#comment-item-' + commentIdx).append(inputGroup);
    }
};

let deleteComment = function (commentIdx) {
    let data = {};
    data.commentIdx = commentIdx;
    data.boardIdx = boardIdx;

    AjaxUtil.ajax('/comment/delete', 'POST', data,
        function (result) {
            selectComment();
        },
        function (result) {
            Alert("error", result.message);
            console.log(result.exception);
        }
    );
};

let likes = function () {
    if (isLiked == 0) {
        AjaxUtil.ajax('/board/likes/insert/' + boardIdx, 'GET', null,
            function (result) {
                isLiked = 1;
                setLikes();
                Alert('info', result.message);
            },
            function (result) {
                Alert("error", result.message);
                console.log(result.exception);
            }
        );
    } else {
        AjaxUtil.ajax('/board/likes/delete/' + boardIdx, 'GET', null,
            function (result) {
                isLiked = 0;
                setLikes();
                Alert('info', result.message);
            },
            function (result) {
                Alert("error", result.message);
                console.log(result.exception);
            }
        );
    }
};