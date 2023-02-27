let newTags = [];
let elementIds = [];
let fileItemId = 0;
let attachedFiles = [];
let deleteContentFileArray = [];
let deleteAttachedFileArray = [];

$(function () {
    initializeEditor();
    initializeStatus();
    initializeDropZone();

    selectTag();
    tagDisplayControl();
    setFileList();

    $('#tag-create').on('click', () => {
        createNewTag();
    });

    $('#tag-input').keydown((event) => {
        if (event.which === 13 && $('#tag-input').val() != null)
            createNewTag();
    });

    $('#update-board').on('click', () => {
        updateBoard();
    });

    $(".select-box").click(function () {
        var select = $(this);

        select.addClass("open").next('.select-box-dropDown').slideDown(100).addClass("open");

        $(document).mouseup(function (e) {
            var setting = $(".select-box-dropDown");
            if (setting.has(e.target).length === 0) {
                setting.removeClass("open").slideUp(100);
                select.removeClass("open");
            }
        });

        $(".select-box-dropDown a").click(function () {
            $(".select-box-dropDown a").removeClass('selected');
            $(".select-box-dropDown").removeClass("open").slideUp(100);
            select.removeClass("open");
            $(this).addClass('selected');
        });
    });
});

let initializeEditor = function () {
    $('#board-content').summernote({
        lang: 'ko-KR',
        placeholder: '내용을 입력해주세요.',
        tabsize: 2,
        height: '50vh',
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
            ['view', ['fullscreen', 'codeview']]
        ],
        callbacks: {
            onImageUpload: function (files, editor, welEditable) {
                for (var i = files.length - 1; i >= 0; i--) {
                    createFile(files[i], 'content', this);
                }
            },
            onMediaDelete: function (url) {
                for (var i = url.length - 1; i >= 0; i--) {
                    let src = url[i].src;
                    deleteContentFileArray.push(src.substring(src.lastIndexOf('/') + 1, src.length));
                }
            }
        }
    });
};

let initializeStatus = function () {
    let data = {};
    data.tagMasterGroup = 'status';
    data.tagGroup = menuId;

    $('#board-status').append($('<option>', {'value': '', 'text': '일반', 'selected': true}))

    AjaxUtil.ajax('/tag/select', 'POST', data,
        function (result) {
            result.forEach(tag => {
                $('<option>', {
                    'value': tag.tagName,
                    'text': tag.tagName
                }).appendTo($('#board-status'));
            });

            $('#board-status').val(status).prop("selected", true);
        },
        function (result) {
            Alert('error', '게시글 상태를 불어오는데 실패했습니다, 시스템 관리자에게 문의하세요.');
            console.log(result);
        }
    );
};

let initializeDropZone = function () {
    $("#file-list").on("dragenter dragover", function (event) {
        event.preventDefault();
    });

    $('#file').change(function () {
        var files = document.getElementsByName("file")[0].files;

        for (var i = 0; i < files.length; i++) {
            attachedFiles.push(files[i]);

            $("#file-list").append('<div id="file-item-' + fileItemId + '">'
                + '<i class="fa-regular fa-file me-1"></i>'
                + '<span class="fw-bold me-1">' + files[i].name + '</span>'
                + '<span class="me-1">(' + convertFileSize(files[i].size) + ')</span>'
                + '<i class="fa-solid fa-ban" onClick="cancelFile(' + fileItemId + ')"></i></div>'
            );

            fileItemId++;
        }
    });

    $("#file-list").on("drop", function (event) {
        event.preventDefault();

        var files = event.originalEvent.dataTransfer.files;

        for (var i = 0; i < files.length; i++) {
            attachedFiles.push(files[i]);

            $("#file-list").append('<div id="file-item-' + fileItemId + '">'
                + '<i class="fa-regular fa-file me-1"></i>'
                + '<span class="fw-bold me-1">' + files[i].name + '</span>'
                + '<span class="me-1">(' + convertFileSize(files[i].size) + ')</span>'
                + '<i class="fa-solid fa-ban" onClick="cancelFile(' + fileItemId + ')"></i></div>'
            );

            fileItemId++;
        }
    });
};

let tagDisplayControl = function () {
    if ($('#tag-area').children().length > 0) {
        $('#tag-area').removeClass('d-none').addClass('d-block');
    } else {
        $('#tag-area').removeClass('d-block').addClass('d-none');
    }
}

let createNewTag = function () {
    let tagName = $('#tag-input').val();
    let colorCode = $('#tag-color').val().replace('#', '').trim();

    newTags.push({'tagName': tagName, 'colorCode': colorCode});

    $('#tag-area').append(
        '<span onclick="removeNewTag(this)" class="badge text-bg-dark me-1" name="tag-item" data-color="' + colorCode + '" style="background-color: #' + colorCode + '!important">' +
        '#' + tagName +
        '</span>'
    );

    tagDisplayControl();

    $('#tag-input').val('');
};

let removeNewTag = function (el) {
    let index = newTags.findIndex(function (tag) {
        return tag.tagName === $(el).text().replace('#', '').trim()
    });
    newTags.splice(index, 1);

    $(el).remove();

    tagDisplayControl();
};

let selectTag = function () {
    let data = {};
    data.tagMasterGroup = targetMenuId;
    data.tagGroup = menuId;

    AjaxUtil.ajax('/tag/select', 'POST', data,
        function (result) {
            if (result != null) {
                $('.select-box-dropDown ul li').remove();

                result.forEach(tag => {
                    if ($('span[name=tag-item]:contains(' + '#' + tag.tagName + ')').length == 0) {
                        $('.select-box-dropDown ul').append(
                            '<li onclick="addTag(this)">' +
                            '<a role="button">' +
                            '<span class="badge text-bg-dark badge-select" data-color="' + tag.colorCode + '" style="background-color: #' + tag.colorCode + '!important">#' + tag.tagName +
                            '</span>' +
                            '</a>' +
                            '</li>'
                        );
                    }
                });
            }
        },
        function (result) {
            Alert('error', '태그 등록에 실패했습니다. 시스템 관리자에게 문의하세요.');
            console.log(result);
        }
    );
};

let addTag = function (el) {
    if ($('#tag-area').children().length >= 10) {
        Alert('error', '태그는 최대 10개까지만 등록할 수 있습니다.');
        return false;
    }

    let tagName = $(el).children().children().text()
    let colorCode = $(el).children().children().data('color');

    $('#tag-area').append(
        '<span onclick="removeTag(this)" class="badge text-bg-dark me-1" name="tag-item" data-color="' + colorCode + '" style="background-color: #' + colorCode + '!important">' +
        tagName +
        '</span>'
    );

    $(el).remove();

    tagDisplayControl();
};

let removeTag = function (el) {
    let tagName = $(el).text();
    let colorCode = $(el).data('color');

    $('.select-box-dropDown ul').append(
        '<li onclick="addTag(this)"><a role="button"><span class="badge text-bg-dark badge-select" data-color="' + colorCode + '" style="background-color: #' + colorCode + '!important">' +
        tagName +
        '</span></a></li>');

    $(el).remove();

    tagDisplayControl();
};

let updateBoard = function () {
    let data = {};
    let tags = [];

    $('span[name=tag-item]').each(function () {
        tags.push({'tagName': $(this).text().replace('#', '').trim(), 'colorCode': $(this).data('color').replace('#', '').trim()});
    });

    data.boardIdx = boardIdx;
    data.boardTitle = $('#board-title').val();
    data.boardContent = $('#board-content').val()
    data.menuId = menuId;
    data.status = $('#board-status').val();
    data.tags = tags;
    data.newTags = newTags;
    data.elementIds = elementIds;

    if (attachedFiles.length > 0) {
        for (let i = 0; i < attachedFiles.length; i++) {
            createFile(attachedFiles[i], 'attach');
        }
    }

    if (deleteAttachedFileArray.length > 0) {
        deleteAttachedFile();
    }

    if (deleteContentFileArray.length > 0) {
        deleteContentFile();
    }

    AjaxUtil.ajax('/board/update', 'POST', data,
        function (result) {
            if (result.ret == 1) {
                Alert('info', result.message);
                window.location.href = '/board/' + menuId;
            } else {
                Alert('error', result.message);
            }
        },
        function (result) {
            Alert('error', '게시글 등록에 실패했습니다. 시스템 관리자에게 문의하세요.');
            console.log(result);
        }
    );
}

let setFileList = function () {
    let data = {};
    data.targetIdx = boardIdx;
    data.targetType = 'board';
    data.fileType = 'attach';

    AjaxUtil.ajax('/file/select', 'POST', data,
        function (result) {
            result.forEach(file => {
                console.log(file);
                $("#file-list").append('<div id="file-item-' + fileItemId + '" data-elementid="' + file.elementId + '">'
                    + '<i class="fa-regular fa-file me-1"></i>'
                    + '<span class="fw-bold me-1">' + file.orgFileName + '</span>'
                    + '<span class="me-1">(' + convertFileSize(file.orgFileSize) + ')</span>'
                    + '<i class="fa-solid fa-ban" onClick="deleteFile(' + fileItemId + ')"></i></div>'
                );

                fileItemId++;
            });
        },
        function (result) {
            Alert('error', '게시글 파일 리스트 조회에 실패하였습니다. 시스템 관리자에게 문의하세요.');
            console.log(result);
        }
    );
}

let cancelFile = function (fileId) {
    $('#file-item-' + fileId).remove();

    insertFileArray[fileId] = null;
};

let deleteFile = function (fileId) {
    console.log(fileId);
    console.log($('#file-item-' + fileId).data('elementid'));
    deleteAttachedFileArray.push($('#file-item-' + fileId).data('elementid'));

    $('#file-item-' + fileId).remove();
};

let createFile = function (file, fileType, el) {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('targetType', 'board');
    formData.append('fileType', fileType);

    AjaxUtil.formData('/file/create', formData,
        function (result) {
            if (result.ret == 0) {
                if (fileType == 'content') {
                    elementIds.push(result.elementId);
                    $(el).summernote('insertImage', result.url);
                } else if (fileType == 'attach') {
                    elementIds.push(result.elementId);
                } else {
                    Alert('error', '비정상적인 파일 타입입니다.');
                }
            } else {
                Alert('error', '게시글 이미지 등록에 실패하였습니다. 시스템 관리자에게 문의하세요.');
                console.log(result.error);
            }
        },
        function (error) {
            Alert('error', '게시글 저장에 실패하였습니다. 시스템 관리자에게 문의하세요.');
            console.log(error);
        }
    );
};

let deleteAttachedFile = function () {
    deleteAttachedFileArray.forEach(elementId => {
        AjaxUtil.ajax('/file/delete/' + elementId, 'GET', null,
            function (result) {
                if (result.ret == 0) {
                    console.log('이미지 삭제 성공', result.elementId);
                } else {
                    Alert('error', result.error);
                }
            },
            function (result) {
                Alert('error', '게시글 삭제에 실패했습니다. 시스템 관리자에게 문의하세요.');
                console.log(result);
            }
        );
    });
};

let deleteContentFile = function () {
    deleteContentFileArray.forEach(elementId => {
        AjaxUtil.ajax('/file/delete/' + elementId, 'GET', null,
            function (result) {
                if (result.ret == 0) {
                    console.log('이미지 삭제 성공', result.elementId);
                } else {
                    Alert('error', result.error);
                }
            },
            function (result) {
                Alert('error', '게시글 삭제에 실패했습니다. 시스템 관리자에게 문의하세요.');
                console.log(result);
            }
        );
    });
};
