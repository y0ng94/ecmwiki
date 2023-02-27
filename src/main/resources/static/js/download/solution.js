$(function () {
    initializeBoard();

    $('#write').on('click', function () {
        location.href = location.href.replace('/board', '/write');
    });

    $('#board-table .list').on('click', 'tr', function () {
        console.log(this);
    });
});

// 게시글 초기화 함수
function initializeBoard() {
    AjaxUtil.ajax('/board/select', 'POST', {'menuId': menuId},
        function (result) {
            if (result.length > 0) {
                $('#board-table .list').empty();

                result.forEach(t => {
                    let target = $('<tr>', {'role': 'button'}).appendTo($('#board-table .list'));
                    $('<td>', {'class': 'align-middle text-center', 'text': t.board_idx}).appendTo(target);

                    let titleTarget = $('<td>', {'class': 'align-middle text-center', 'text': t.board_title}).appendTo(target);
                    $('<span>', {'class': 'badge badge-phoenix fs--2 badge-phoenix-danger', 'text': t.board_status}).prependTo(titleTarget);

                    let userTarget = $('<td>', {'class': 'align-middle text-center'}).appendTo(target);
                    let userInnerTarget = $('<div>', {'class': 'font-sans-serif btn-reveal-trigger position-static'}).appendTo(userTarget);

                    $('<div>', {
                        'class': 'btn dropdown-toggle dropdown-caret-none transition-none border-0',
                        'type': 'button',
                        'data-bs-toggle': 'dropdown',
                        'data-boundary': 'window',
                        'aria-haspopup': 'true',
                        'aria-expanded': 'false',
                        'data-bs-reference': 'parent',
                        'text': t.user_name
                    }).appendTo(userInnerTarget);

                    $('<a>', {'class': 'dropdown-item', 'href': '#!', 'text': '게시글 보기'}).appendTo($('<div>', {'class': 'dropdown-menu dropdown-menu-end py-2'}).appendTo(userInnerTarget));

                    $('<td>', {'class': 'align-middle text-center', 'text': t.regist_date}).appendTo(target);
                    $('<td>', {'class': 'align-middle text-center', 'text': t.board_hits}).appendTo(target);
                    $('<td>', {'class': 'align-middle text-center', 'text': t.board_likes}).appendTo(target);
                });
            }
        },
        function (result) {
            Alert('error', '게시글을 불러오는데 실패했습니다, 시스템 관리자에게 문의하세요.');
        }
    );
}