$(function() {
	let message = new URL(location.href).searchParams.get('message');
	if (message != null)
		Alert('success', message);

	history.replaceState({}, null, location.pathname);

    initializeSiteStatus();

    $('#write').on('click', function () {
        location.href = location.href.replace('/siteStatus', '/siteStatus/write');
    });

	$('#search-btn').on('click', function() {
		$('#site-status-table').bootstrapTable('filterBy', {
			title: $('#search').val()
		}, {
			'filterAlgorithm': (row, filters) => {
				let rowText = $(row.title)[$(row.title).length - 1].text;
				let filtersText = filters.title;

				rowText = ((rowText != undefined && rowText != null) ? rowText.toLowerCase() : rowText);
				filtersText = ((filtersText != undefined && filtersText != null) ? filtersText.toLowerCase() : filtersText);

				let rowTagText = '';
				if (row.tagList != undefined && row.tagList != null) {
					$(row.tagList).each((index, item) => {
						rowTagText = rowTagText + '  ' + $(item).text();
					});
				}

				return rowText.indexOf(filtersText) != -1 || rowTagText.toLowerCase().indexOf(filtersText) != -1
			}
		});
	});

	$('#search').on('keydown', function(e) {
		if (e.which === 13) { $('#search-btn').trigger('click'); }
	});
	
});

// 사이트 현황 초기화 함수
function initializeSiteStatus() {
    AjaxUtil.ajax('/getSiteStatusList', 'POST', {},
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

					let siteData = JSON.parse(data["siteData"]);
					let now = new Date();
					$json.title = "<a class='text-reset text-decoration-none text-break text-truncate " + ((new Date(now.setDate(now.getDate() - 1)) <= new Date(data.registDate)) ? 'new' : '') + "' href='/siteStatus/" + data.siteIdx + "'>[" + siteData["site-name"] + "] " + siteData["project-name"] + "</a>";

					$json.tagList = '';
					data.tagList.forEach(tag => {
						$json.tagList += '<span class="badge text-bg-dark me-1" style="background-color: #' + tag.colorCode + '!important">' + tag.tagName + '</span>'
					});

					$json.userName = "<div class='dropdown'><a class='btn dropdown-toggle' data-bs-toggle='dropdown'>" + data.userName + "</a><ul class='dropdown-menu'><li><a class='dropdown-item' href='#'>작성글 보기</a></li></ul></div>";
					$json.registDate = (data.registDate.substring(0, 10) == new Date().customFormat() ? data.registDate.substring(11) : data.registDate.substring(2, 10));

					$data.push($json);
				});
				
				$('#site-status-table').bootstrapTable({
					pagination: true,
					columns: [ {field: 'title'}, {field: 'tagList'}, {field: 'userName', align: 'left'}, {field: 'registDate'} ],
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
            Alert('error', '사이트 현황을 불러오는데 실패했습니다, 시스템 관리자에게 문의하세요.');
        }
    );
}