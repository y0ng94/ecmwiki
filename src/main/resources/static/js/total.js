let clickDisabled = false;

$(function() {
	history.replaceState({}, null, location.pathname);

	if ($('#search').val() != null) { totalSearch(); }

	$('#search').on('keypress', function(e) {
		if (e.which === 13)  { totalSearch(); }
	});

	$('#search-btn').on('click', function(e) {
		totalSearch();
	});
});

function totalSearch() {
	AjaxUtil.ajax("/totalSearch", "POST", { 'word' : $('#search').val() },
		function(result) {
			if (result == null || result.length == 0) {
				resetTable();
				createTable('no-data');
				return;
			}
			
			resetTable();

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

			let now = new Date();
			let target = result.map(t => t.targetMenu + ' / ' + t.menuId).reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);

			target.forEach(x => {
				let $data = [];
				let $filterData = result.filter(y => {
					return ((y.targetMenu + ' / ' + y.menuId) == x);
				});

				$filterData.forEach(z => {
					let $json = {};

					$json.tagList = '';
					if (z.tagList != undefined) {
						z.tagList.forEach(tag => {
							$json.tagList += '<span class="badge text-bg-dark me-1" style="background-color: #' + tag.colorCode + '!important">' + tag.tagName + '</span>'
						});
					}

					$json.title = "";
					$json.title += "<a class='text-reset text-decoration-none text-break text-truncate " + ((new Date(now.setDate(now.getDate() - 1)) <= new Date(z.registDate)) ? 'new' : '') + "'";
					$json.title += "href='" + z.linkUrl + '/' + z.totalIdx + "'>" + z.totalTitle + "</a>";

					$json.userName = "<div class='dropdown'><a class='btn dropdown-toggle' data-bs-toggle='dropdown'>" + z.userName + "</a><ul class='dropdown-menu'><li><a class='dropdown-item' href='#'>작성글 보기</a></li></ul></div>";
					$json.registDate = (z.registDate.substring(0, 10) == new Date().customFormat() ? z.registDate.substring(11) : z.registDate.substring(2, 10));

					$data.push($json);
				});

				let title = $filterData.map(t => t.targetMenuName + ' / ' + t.menuName).reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
			
				createTable(x, title).bootstrapTable({
					pagination: true,
					columns: [ {field: 'tagList'}, {field: 'title'}, {field: 'userName', align: 'left'}, {field: 'registDate'} ],
					data: $data,
					showHeader: false,
					classes: 'table',
					pageSize: 20,
					pageList: 'hide',
					paginationLoop: false
				});
			});
		},
		function(result) {
			resetTable();
			createTable('no-data');

			Alert('error', '통합 검색 목록을 가져오는데 실패했습니다. 시스템 관리자에게 문의하세요.');

			clickDisabled = true;
		}
	);
}

function resetTable() {
	$('#total-search-table').html('');
}

function createTable($id, $title) {
	let target = $('#total-search-table');

	if ($title) {
		let titleContainer = $('<div>', {
			'class' : 'row justify-content-start align-items-center py-3'
		}).appendTo(target);

		let titleWrapper = $('<div>', {
			'class' : 'col col-auto'
		}).appendTo(titleContainer);

		$('<h4>', {
			'class' : 'sub-title',
			'text'	: $title
		}).appendTo(titleWrapper);
	}

	let table = $('<table>', {
		'class'	: 'table align-middle',
		'id'	: 'total-search-table-' + $id
	}).appendTo(target);

	$('<thead>').appendTo(table);

	let tbody = $('<tbody>').appendTo(table);
	let tr = $('<tr>').appendTo(tbody);

	$('<td>', {
		'class'		: 'align-middle text-center text-900',
		'colspan'	: '6',
		'text'		: '통합 검색 목록이 존재하지 않습니다.'
	}).appendTo(tr);

	return table;
}