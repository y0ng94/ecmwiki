let saveDisabled = false;

$(function() {
	// 1.Project 항목 Datepicker 초기화
	initializeDateRangePicker();
	// 3.Engine 항목 Archive & Volume 테이블 초기화
	initializeArchiveTable();
	// 3.Engine 항목 Content Class 테이블 초기화
	initializeContentClassTable();
	// 8.Tag 항목 Select box 초기화
	initializeTag();

	// 각 항목 Reset button 툴팁 생성
	$("#project-reset-btn").tooltip();
	// 각 항목 Default 값 생성 button 툴팁 생성
	$("#project-default-btn").tooltip();
	// Archive & Volume 추가 button 툴팁 생성
	$("#archive-add-btn").tooltip();
	// Archive & Volume 삭제 button 툴팁 생성
	$("#archive-remove-btn").tooltip();
	// Content Class 추가 button 툴팁 생성
	$("#cc-add-btn").tooltip();
	// Content Class 삭제 button 툴팁 생성
	$("#cc-remove-btn").tooltip();

	// 사이트 현황 등록 버튼 클릭 이벤트
	$('.insert-site-status').on('click', function() {
		let data = $('#write-form').serializeObject();

		// Validation check : 저장 가능 상태 체크
		if (saveDisabled) {
			Alert('error', '저장할 수 없는 상태입니다.');

			return false;			
		}

		// Validation check : 사이트 명 체크
		if (data['site-name'] == null || data['site-name'] == '') {
			Alert('error', '사이트 명을 입력해주세요.');

			$('#site-name').focus();

			return false;
		}

		// Validation check : 프로젝트 명 체크
		if (data['project-name'] == null || data['project-name'] == '') {
			Alert('error', '프로젝트 명을 입력해주세요.');

			$('#project-name').focus();

			return false;
		}

		// Archive & Volume 데이터 수집
		data['engine-archive'] = getArchiveInfo();

		// Content Class 데이터 수집
		data['engine-cc'] = getCCInfo();

		// 태그 데이터 수집
		let tagList = getTagList();

		// 프로젝트 명
		let siteTitle = '[' + data['site-name'] + '] ' + data['project-name'];

		AjaxUtil.ajax('/putSiteStatus', 'POST', {'siteTitle' : siteTitle, 'siteData' : JSON.stringify(data), 'tagList' : tagList}, 
			function(result) {
				location.href = '/siteStatus?message=사이트 현황을 등록했습니다.';
			},
			function(result) {
				Alert('error', '사이트 현황을 저장하는데 실패했습니다, 시스템 관리자에게 문의하세요.');

				saveDisabled = true;
			}
		);
	});

	// 태그 추가 Select box 클릭 이벤트
    $(".select-box").click(function() {
        var select = $(this);

        select.addClass("open").next('.select-box-dropDown').slideDown(100).addClass("open");

        $(document).mouseup(function(e) {
            var setting = $(".select-box-dropDown");
            if (setting.has(e.target).length === 0) {
                setting.removeClass("open").slideUp(100);
                select.removeClass("open");
            }
        });

        $(".select-box-dropDown a").click(function() {
            $(".select-box-dropDown a").removeClass('selected');
            $(".select-box-dropDown").removeClass("open").slideUp(100);
            select.removeClass("open");
            $(this).addClass('selected');
        });
    });

	// Input 태그 값 변경 시 색상 변경
	$(document).on("propertychange change keyup paste input", "input", function() {
		if ($(this).val() != null && $(this).val().trim() != '')
			$(this).addClass('inputted');
	});

	// Select 태그 값 변경 시 색상 변경
	$(document).on("propertychange change keyup paste input", "select", function() {
		if ($(this).val() != null && $(this).val().trim() != '')
			$(this).addClass('inputted');
	});

	// Textarea 태그 값 변경 시 색상 변경
	$(document).on("propertychange change keyup paste input", "textarea", function() {
		if ($(this).val() != null && $(this).val().trim() != '')
			$(this).addClass('inputted');
	});

	// Reset button 클릭 이벤트
	$('.reset-btn').on('click', function() {
		$($(this).parents('.card-body')).find('input').each((index, item) => {
			$(item).val('');
			$(item).removeClass('inputted');
		});

		$($(this).parents('.card-body')).find('select').each((index, item) => {
			$(item).find('option:eq(0)').prop("selected", true)
			$(item).removeClass('inputted');
		});

		$($(this).parents('.card-body')).find('textarea').each((index, item) => {
			$(item).val('');
			$(item).removeClass('inputted');
		});
	});

	// Default 값 생성 button 클릭 이벤트
	$('.default-btn').on('click', function() {
		$($(this).parents('.card-body')).find('input').each((index, item) => {
			if ($(item).val() == '') {
				$(item).val($(item).data('default'));
				$(item).addClass('inputted');
			}
		});

		$($(this).parents('.card-body')).find('select').each((index, item) => {
			$(item).val($(item).data('default')).prop('selected', true);
			$(item).addClass('inputted');
		});

		$($(this).parents('.card-body')).find('textarea').each((index, item) => {
			if ($(item).val() == '') {
				$(item).val($(item).data('default').replace(/\\n/g, '\n'));
				$(item).addClass('inputted');
			}
		});
	});

	// 3.Engine Archive & Volume 입력 내용 Row 추가 Button 클릭 이벤트
	$('#archive-add-btn').on('click', function() {
		addArchiveInfo();
	});

	// 3.Engine Archive & Volume 입력 내용 선택 Row 삭제 Button 클릭 이벤트
	$('#archive-remove-btn').on('click', function() {
		removeArchiveInfo();
	});

	// 3.Engine 용량 계산 이벤트
	$('#maxSpace').on('change', function() {
		if ($(this).val() != '') {
			if ($('#percent').val() != '') {
				$('#usableSpace').val(Math.round($('#maxSpace').val() / 100 * $(this).val()));
				$('#usableSpace').addClass('inputted');
			}
		}
	})

	$('#percent').on('change', function() {
		if ($(this).val() != '') {
			if ($('#maxSpace').val() != '') {
				$('#usableSpace').val(Math.round($('#maxSpace').val() / 100 * $(this).val()));
				$('#usableSpace').addClass('inputted');
			}
		}
	})

	// 3.Engine Content Class 입력 내용 Row 추가 Button 클릭 이벤트
	$('#cc-add-btn').on('click', function() {
		addCCInfo();
	});

	// 3.Engine Content Class 입력 내용 선택 Row 삭제 Button 클릭 이벤트
	$('#cc-remove-btn').on('click', function() {
		removeCCInfo();
	});

	// 3.Engine 항목 입력 박스 추가 button 클릭 이벤트
	$('#engine-add-btn').on('click', function() {
		addEngineInfo();
	});

	// 4.WEB & WAS 항목 입력 박스 추가 button 클릭 이벤트
	$('#webwas-add-btn').on('click', function() {
		addWebWasInfo();
	});

	// 5.DB 항목 입력 박스 추가 button 클릭 이벤트
	$('#db-add-btn').on('click', function() {
		addDbInfo();
	});

	// 3.Engine 항목 입력 박스 제거 button 클릭 이벤트
	$(document).on("click", ".engine-remove-btn", function() {
		removeInfo($(this));
	});

	// 4.WEB & WAS 항목 입력 박스 제거 button 클릭 이벤트
	$(document).on("click", ".webwas-remove-btn", function() {
		removeInfo($(this));
	});

	// 5.DB 항목 입력 박스 제거 button 클릭 이벤트
	$(document).on("click", ".db-remove-btn", function() {
		removeInfo($(this));
	});

	// 8.Tag 항목 Select box 선택(태그 추가) 이벤트
	$(document).on("click", "#add-tag ul li", function() {
		addTag($(this));
	});

	// 8.Tag 항목 Tag 배찌 클릭(태그 삭제) 이벤트
	$(document).on("click", "#tag-form .card-body span", function() {
		removeTag($(this));
	});

	// 태블릿, 모바일 화면 Remote button 클릭 이벤트
	$('#site-remote-btn').on('click', function() {
		if ($('.site-remote').hasClass('show')) {
			$('.site-remote').removeClass('show');
			$(this).html('<i class="fa-sharp fa-solid fa-arrow-up"></i>');
		} else {
			$('.site-remote').addClass('show');
			$(this).html('<i class="fa-sharp fa-solid fa-arrow-down"></i>');
		}
	});
});

// 날짜 선택 Input을 초기화한다.
function initializeDateRangePicker() {
	$('.input-daterange').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: 'ko'
	});
}

// 아카이브 & 볼륨 테이블을 초기화한다.
function initializeArchiveTable() {
	$('#engine-archive-table').bootstrapTable({
		pagination: false,
		columns: [ {field: 'checkbox', checkbox: true}, {field: 'archive', title:'Archive(BaseDir)', align: 'center'}, {field: 'volume', title:'Volume', align: 'center'}, {field: 'physical', title:'physical', align: 'center'}, {field: 'fileSystemKB', title: 'FileSystemKB', align: 'center'}, {field: 'maxSpace', title: 'Max Space', align: 'center'}, {field: 'usableSpace', title: 'Usable Space', align: 'center'}],
		data: [],
		showHeader: true,
		classes: 'table'
	});
}

// 라이프사이클 테이블을 초기화한다.
function initializeContentClassTable() {
	$('#engine-cc-table').bootstrapTable({
		pagination: false,
		columns: [ {field: 'checkbox', checkbox: true}, {field: 'contentClass', title:'Content Class', align: 'center'}, {field: 'contentState', title:'Content State', align: 'center'}, {field: 'stateLocation', title:'State Location', align: 'center'} ],
		data: [],
		showHeader: true,
		classes: 'table'
	});
}

// 태그 선택 Select box를 초기화한다.
function initializeTag() {
	let json = {
		'tagMasterGroup': $('.target-menu').val(),
		'tagGroup'		: $('.menu-id').val()
	};

	AjaxUtil.ajax('/tag/select', 'POST', json, 
		function(result) {
			if (result.length == 0) {
				Alert('error', '태그들을 불러오는데 실패했습니다, 시스템 관리자에게 문의하세요.');

				saveDisabled = true;
			} else {
				result.forEach(t => {
					let li = $('<li>').appendTo($('#add-tag ul'));
	
					let a = $('<a>', {
						'role'	: 'button'
					}).appendTo(li);
	
					$('<span>', {
						'class'			: 'badge text-bg-dark badge-select',
						'data-color'	: t.colorCode,
						'style'			: "background-color: #" + t.colorCode + " !important",
						'text'			: t.tagName
					}).appendTo(a);
				});
			}
		},
		function(result) {
            Alert('error', '태그들을 불러오는데 실패했습니다, 시스템 관리자에게 문의하세요.');

			saveDisabled = true;
		}
	);
}

// 태그 추가 이벤트
function addTag(el) {
    if ($('#tag-form .card-body').children().length >= 5) {
        Alert('error', '태그는 최대 5개까지만 등록할 수 있습니다.');
        return false;
    }

    let tagName = $(el).children().children().text()
    let colorCode = $(el).children().children().data('color');

	$('<span>', {
		'class'		: 'badge text-bg-dark me-1',
		'name'		: 'tag-item',
		'data-color': colorCode,
		'style'		: 'background-color: #' + colorCode + '!important',
		'role'		: 'button',
		'text'		: tagName
	}).appendTo($('#tag-form .card-body'));

    $(el).remove();

    if ($('#tag-form .card-body').children().length > 0)
        $('#tag-form .card-body').removeClass('d-none').addClass('d-block');

	if (!$('#tag-card').hasClass('inputted'))
		$('#tag-card').addClass('inputted');
}

// 태그 삭제 이벤트
function removeTag(el) {
    let tagName = $(el).text();
    let colorCode = $(el).data('color');
	
	let li = $('<li>').appendTo($('#add-tag ul'));

	let a = $('<a>', {
		'role'	: 'button'
	}).appendTo(li);

	$('<span>', {
		'class'			: 'badge text-bg-dark badge-select',
		'data-color'	: colorCode,
		'style'			: "background-color: #" + colorCode + " !important",
		'text'			: tagName
	}).appendTo(a);

    $(el).remove();

    if ($('#tag-area').children().length == 0)
        $('#tag-area').removeClass('d-none').addClass('d-block');

	if (getTagList() == undefined || getTagList() == null || getTagList().length == 0)
		$('#tag-card').removeClass('inputted');
}

// 현 스크롤 위치에 따른 Site Remote 버튼 색상 변경 이벤트
function linksActive() {
	let links = document.querySelectorAll('#remote-controller a');

    links.forEach(link => {
		if (!link.hash) return;
	
		let section = document.querySelector(link.hash);
		if (!section) return;

		let position = window.scrollY + 200;

		if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
			link.classList.add('here');
		} else {
			link.classList.remove('here');
		}
	})
}

// 화면 로드 혹은 스크롤 시 Site Remove 버튼 색상 변경 이벤트
window.addEventListener('load', linksActive);
document.addEventListener('scroll', linksActive);

// Archive & Volume Row 추가 이벤트
function addArchiveInfo() {
	let archive = $('#archive').val();
	let volume = $('#volume').val();
	let maxSpace = $('#maxSpace').val();
	let usableSpace = $('#usableSpace').val();
	let row = {};

	let dupCheck = getArchiveInfo().filter(t => {
		if (t.archive == archive && t.volume == volume) return t;
	});

	if (dupCheck.length != 0) {
		Alert('error', '이미 저장된 아카이브 & 볼륨 정보입니다.');
		return;
	}

	if (archive == undefined || archive == null || archive.trim() == '') {
		Alert('error', '아카이브 명을 입력해주세요.');
		$('#archive').focus();
		return;
	}

	if (volume == undefined || volume == null || volume.trim() == '') {
		Alert('error', '볼륨 명을 입력해주세요.');
		$('#volume').focus();
		return;
	}

	if (maxSpace == undefined || maxSpace == null || maxSpace == 0) {
		Alert('error', '볼륨 최대 용량을 입력해주세요.');
		$('#maxSpace').focus();
		return;
	}

	if (usableSpace == undefined || usableSpace == null || usableSpace == 0) {
		Alert('error', '볼륨 사용 용량을 입력해주세요.');
		$('#usableSpace').focus();
		return;
	}

	row['archive'] = archive;
	row['volume'] = volume;
	row['physical'] = $('#physical').is(':checked');
	row['fileSystemKB'] = $('#fileSystemKB').is(':checked');
	row['maxSpace'] = maxSpace;
	row['usableSpace'] = usableSpace;

	$('#archive').val('');
	$('#archive').removeClass('inputted');
	$('#volume').val('');
	$('#volume').removeClass('inputted');
	$('#maxSpace').val('');
	$('#maxSpace').removeClass('inputted');
	$('#usableSpace').val('');
	$('#usableSpace').removeClass('inputted');

	$('#engine-archive-table').bootstrapTable('append', row);
	$('#engine-archive-table').bootstrapTable('scrollTo', 'bottom');

	if (!$('#engine-archive-table').hasClass('inputted'))
		$('#engine-archive-table').addClass('inputted');
}

// Archive Volume Row 삭제 이벤트
function removeArchiveInfo() {
	var target = $.map($('#engine-archive-table').bootstrapTable('getSelections'), function (row) {
		return row;
	})
	
	if (target == null || target.length == 0) {
		Alert('error', '삭제할 대상을 선택해주세요.');
		return;
	}

	target.forEach(t => {
		$('#engine-archive-table').bootstrapTable('remove',
			{
				field: 'archive',
				values: t.archive
			},
			{
				field: 'volume',
				values: t.volume
			}
		);
	});
	
	if (getArchiveInfo() == undefined || getArchiveInfo() == null || getArchiveInfo().length == 0)
		$('#engine-archive-table').removeClass('inputted');
}

function getArchiveInfo() {
	return $('#engine-archive-table').bootstrapTable('getData');
}

// Content Class Row 추가 이벤트
function addCCInfo() {
	let contentClass = $('#contentClass').val();
	let contentState = $('#contentState').val();
	let stateLocation = $('#stateLocation').val();
	let row = {};

	let dupCheck = getCCInfo().filter(t => {
		if (t.contentClass == contentClass && t.contentState == contentState) return t;
	});

	if (dupCheck.length != 0) {
		Alert('error', '이미 저장된 라이프 사이클 정보입니다.');
		return;
	}

	if (contentClass == undefined || contentClass == null || contentClass.trim() == '') {
		Alert('error', '컨텐츠 클래스 명을 입력해주세요.');
		$('#contentClass').focus();
		return;
	}

	if (contentState == undefined || contentState == null || contentState.trim() == '') {
		Alert('error', '컨텐츠 클래스 명을 입력해주세요.');
		$('#contentState').focus();
		return;
	}

	if (stateLocation == undefined || stateLocation == null || stateLocation.trim() == '') {
		Alert('error', '컨텐츠 클래스 명을 입력해주세요.');
		$('#stateLocation').focus();
		return;
	}

	row['contentClass'] = contentClass;
	row['contentState'] = contentState;
	row['stateLocation'] = stateLocation;

	$('#contentClass').val('');
	$('#contentClass').removeClass('inputted');
	$('#contentState').val('');
	$('#contentState').removeClass('inputted');
	$('#stateLocation').val('');
	$('#stateLocation').removeClass('inputted');

	$('#engine-cc-table').bootstrapTable('append', row);
	$('#engine-cc-table').bootstrapTable('scrollTo', 'bottom');

	if (!$('#engine-cc-table').hasClass('inputted'))
		$('#engine-cc-table').addClass('inputted');
}

// Content Class Row 삭제 이벤트
function removeCCInfo() {
	var target = $.map($('#engine-cc-table').bootstrapTable('getSelections'), function (row) {
		return row;
	})
	
	if (target == null || target.length == 0) {
		Alert('error', '삭제할 대상을 선택해주세요.');
		return;
	}

	target.forEach(t => {
		$('#engine-cc-table').bootstrapTable('remove',
			{
				field: 'contentClass',
				values: t.contentClass
			},
			{
				field: 'contentState',
				values: t.contentState
			}
		);
	});

	
	if (getCCInfo() == undefined || getCCInfo() == null || getCCInfo().length == 0)
		$('#engine-cc-table').removeClass('inputted');
}

function getCCInfo() {
	return $('#engine-cc-table').bootstrapTable('getData');
}

// 엔진 입력 박스 추가 이벤트
function addEngineInfo() {
	var html = '';
	
	html += '<div class="col-12 col-sm-12 mb-3 ">';
	html += '	<div class="card add-card engine-add-card">';
	html += '		<div class="card-body">';
	html += '			<div class="row">';
	html += '				<div class="col-12 col-sm-12 mb-3 text-end">';
	html += '					<button type="button" class="btn engine-remove-btn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="삭제">';
	html += '						<i class="fa-solid fa-x" aria-hidden="true"></i>';
	html += '					</button>';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="engine-category" class="fw-bold">엔진 구분</label>';
	html += '					<input class="form-control" name="engine-category" type="text" data-default="운영" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="engine-port" class="fw-bold">엔진 Port</label>';
	html += '					<input class="form-control" name="engine-port" type="number" data-default="2102" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-12 mb-3">';
	html += '					<label for="engine-access" class="fw-bold">접속 정보 (IP / Domain)</label>';
	html += '					<input class="form-control" name="engine-access" type="text" data-default="127.0.0.1 / ecm.domain.com" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-12 mb-3">';
	html += '					<label for="engine-path" class="fw-bold">엔진 설치 경로</label>';
	html += '					<input class="form-control" name="engine-path" type="text" data-default="/app/xtorm" />';
	html += '				</div>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';

	$('#engine>.card-body>.row').append(html);
}

// WEB & WAS 입력 박스 추가 이벤트
function addWebWasInfo() {
	var html = '';

	html += '<div class="col-12 col-sm-12 mb-3 ">';
	html += '	<div class="card add-card webwas-add-card">';
	html += '		<div class="card-body">';
	html += '			<div class="row">';
	html += '				<div class="col-12 col-sm-12 mb-3 text-end">';
	html += '					<button type="button" class="btn webwas-remove-btn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="삭제">';
	html += '						<i class="fa-solid fa-x" aria-hidden="true"></i>';
	html += '					</button>';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="webwas-category" class="fw-bold">서버 구분</label>';
	html += '					<input class="form-control" name="webwas-category" type="text" data-default="운영" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="webwas-admin-version" class="fw-bold">웹 관리자 버전</label>';
	html += '					<select class="form-select" name="webwas-admin-version" data-default="구 웹 관리자">';
	html += '						<option selected value=""></option>';
	html += '						<option value="구 웹 관리자">구 웹 관리자</option>';
	html += '						<option value="신 웹 관리자">신 웹 관리자</option>';
	html += '					</select>';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-12 mb-3">';
	html += '					<label for="webwas-access" class="fw-bold">접속 정보</label>';
	html += '					<input class="form-control" name="webwas-access" type="text" data-default="http://127.0.0.1:9102/xtorm/index.jsp" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="webwas-web-server" class="fw-bold">WEB Server</label>';
	html += '					<input class="form-control" name="webwas-web-server" type="text" data-default="WebToB 5" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="webwas-was-server" class="fw-bold">WAS Server</label>';
	html += '					<input class="form-control" name="webwas-was-server" type="text" data-default="Jeus 8.5" />';
	html += '				</div>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>'

	$('#webwas>.card-body>.row').append(html);
}

// DB 입력 박스 추가 이벤트
function addDbInfo() {
	var html = '';

	html += '<div class="col-12 col-sm-12 mb-3 ">';
	html += '	<div class="card add-card db-add-card">';
	html += '		<div class="card-body">';
	html += '			<div class="row">';
	html += '				<div class="col-12 col-sm-12 mb-3 text-end">';
	html += '					<button type="button" class="btn db-remove-btn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="삭제">';
	html += '						<i class="fa-solid fa-x" aria-hidden="true"></i>';
	html += '					</button>';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-category" class="fw-bold">DB 서버 구분</label>';
	html += '					<input class="form-control" name="db-category" type="text" data-default="운영" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-type" class="fw-bold">DB 종류</label>';
	html += '					<select class="form-select" name="db-type" data-default="Oracle">';
	html += '						<option selected value=""></option>';
	html += '						<option value="Oracle">Oracle</option>';
	html += '						<option value="MySQL">MySQL</option>';
	html += '						<option value="MariaDB">MariaDB</option>';
	html += '						<option value="Tibero">Tibero</option>';
	html += '						<option value="Postgersql">Postgersql</option>';
	html += '						<option value="MsSQL">MsSQL</option>';
	html += '						<option value="DB2">DB2</option>';
	html += '						<option value="Sybase">Sybase</option>';
	html += '						<option value="Altibase">Altibase</option>';
	html += '						<option value="Informix">Informix</option>';
	html += '						<option value="Etc">Etc</option>';
	html += '					</select>';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-version" class="fw-bold">DB 버전</label>';
	html += '					<input class="form-control" name="db-version" type="text" data-default="Oracle 19c" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-composition" class="fw-bold">엔진 구성 방식</label>';
	html += '					<select class="form-select" name="db-composition" data-default="Stand Alone">';
	html += '						<option selected value=""></option>';
	html += '						<option value="Stand Alone">Stand Alone</option>';
	html += '						<option value="Active Standby">Active Standby</option>';
	html += '						<option value="Active Active">Active Active</option>';
	html += '						<option value="Multiple Active Active">Multiple Active Active</option>';
	html += '					</select>';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-12 mb-3">';
	html += '					<label for="db-address" class="fw-bold">DB 주소 (Domain)</label>';
	html += '					<input class="form-control" name="db-address" type="text" data-default="127.0.0.1" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-user" class="fw-bold">DB User 및 권한</label>';
	html += '					<input class="form-control" name="db-user" type="text" data-default="XTORM (Select, Delete, Update 권한)" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-pw" class="fw-bold">DB 패스워드 및 암호화 여부</label>';
	html += '					<input class="form-control" name="db-pw" type="text" data-default="XTORM (Xtorm 자체 암호화 적용)" />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-name" class="fw-bold">DB SID or Service name or Database 명</label>';
	html += '					<input class="form-control" name="db-name" type="text" data-default="XTORM" />';
	html += '				</div>';
	html += '';	
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-port" class="fw-bold">DB Port</label>';
	html += '					<input class="form-control" name="db-port" type="text" data-default="1521" />';
	html += '				</div>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';

	$('#db>.card-body>.row').append(html);
}

// WEB & WAS, DB 입력 박스 삭제 이벤트
function removeInfo($target) {
	$target.parents('.add-card').remove();
}

// 현재 태그 리스트를 가지고 온다.
function getTagList() {
	let tagList = [];

	if ($('#tag-form .card-body span').length != 0) {
		$('#tag-form .card-body span').each((index, item) => {
			tagList.push({
				'tagName'			: $(item).text(),
				'colorCode'			: $(item).data('color'),
				'tagMasterGroup'	: $('.target-menu').val(),
				'tagGroup'			: $('.menu-id').val()
			});
		});
	}

	return tagList;
}