$(function () {
    initializeBoard();
	selectCurrentBoard();

    $('#write').on('click', function () {
        location.href = location.href.replace('/board', '/board/write');
    });

    $('#board-table .list').on('click', 'tr', function () {
        console.log(this);
    });

	$('#search-btn').on('click', function() {
		$('#board-table').bootstrapTable('filterBy', {
			title: $('#search').val()
		}, {
			'filterAlgorithm': (row, filters) => {
				let rowText = '';
				if (row.title != undefined && row.title != null) {
					$(row.title).each((index, item) => {
						rowText = rowText + '  ' + $(item).text();
					});
				}
				let filtersText = filters.title;

				rowText = ((rowText != undefined && rowText != null) ? rowText.toLowerCase() : rowText);
				filtersText = ((filtersText != undefined && filtersText != null) ? filtersText.toLowerCase() : filtersText);

				return rowText.indexOf(filtersText) != -1;
			}
		});
	});

	$('#search').on('keydown', function(e) {
		if (e.which === 13) { $('#search-btn').trigger('click'); }
	});
});

// 게시글 초기화 함수
function initializeBoard() {
    AjaxUtil.ajax('/board/select', 'POST', { 'menuId': menuId },
        function (result) {
			let $data = [];

			if (result != null && result.length != 0) {
				result.forEach(data => {
					let $json = {};

					Date.prototype.customFormat = function () {
						var yyyy = this.getFullYear().toString();
						var MM = pad(this.getMonth() + 1,2);
						var dd = pad(this.getDate(), 2);

						return yyyy + '-' + MM + '-' + dd;
					};

					let pad = function(number, length) {
						var str = '' + number;
							while (str.length < length)
							str = '0' + str;
						return str;
					}

					var now = new Date();

					$json.title = ((data.status != null && data.status != '') ? ("<span class='badge text-bg-dark me-1' style='background-color:#" + data.colorCode +"!important'>" + data.status + "</span>") : "") + "<a class='text-reset text-decoration-none text-break text-truncate " + ((new Date(now.setDate(now.getDate() - 1)) <= new Date(data.registDate)) ? 'new' : '') + "' href='/board/" + menuId + "/" + data.boardIdx + "'>" + data.boardTitle + "</a>";
					$json.userName = "<div class='dropdown'><a class='btn dropdown-toggle' data-bs-toggle='dropdown'>" + data.userName + "</a><ul class='dropdown-menu'><li><a class='dropdown-item' href='#'>작성글 보기</a></li></ul></div>";
					$json.registDate = (data.registDate.substring(0, 10) == new Date().customFormat() ? data.registDate.substring(11) : data.registDate.substring(2, 10));
					$json.boardHitsNLikes = "<i class='fa-solid fa-eye me-1 text-success'></i>" + data.boardHits + "<i class='fa-regular fa-thumbs-up me-1 ms-3 text-primary'></i>" + data.boardLikes + "<i class='fa-solid fa-comment-dots me-1 ms-3 text-warning'></i>" + data.boardCommentCount;

					$data.push($json);
				});
				
				$('#board-table').bootstrapTable({
					pagination: true,
					columns: [ {field: 'title', align: 'left'}, {field: 'userName', align: 'right'}, {field: 'boardHitsNLikes', align: 'left'}, {field: 'registDate', align: 'right'} ],
					data: $data,
					showHeader: false,
					classes: 'table',
					pageSize: 15,
					pageList: 'hide',
					paginationLoop: false
				});
			}
        },
        function (result) {
            Alert('error', '게시글을 불러오는데 실패했습니다, 시스템 관리자에게 문의하세요.');
        }
    );
}

// 현재 게시글 선택 이벤트
function selectCurrentBoard() {
	$('.dropdown-content a[href="' + window.location.pathname + '"]').addClass('current');
}