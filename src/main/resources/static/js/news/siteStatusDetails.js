$(function() {
	let message = new URL(location.href).searchParams.get('message');
	if (message != null)
		Alert('success', message);

	history.replaceState({}, null, location.pathname);
	
	// 3.Engine 항목 Archive & Volume 테이블 초기화
	initializeArchiveTable();
	// 3.Engine 항목 Content Class 테이블 초기화
	initializeContentClassTable();

	// 사이트 현황 불러오기
	getSiteStatus();

	$('.index-site-status').on('click', function() {
        location.href = '/siteStatus';
	});

	$('.download-site-status').on('click', function() {
		let array = [];
    
		$('label').each((index, item) => {
			if ($(item).attr('for') != undefined && $(item).attr('for') != null && $(item).attr('for') != '') {
				let json = {};
				let target = $('#' + $(item).attr('for'));

				if (target != undefined && target != null && target.length != 0) {
					json.category = $(item).attr('for').substr(0, $(item).attr('for').indexOf('-'));
					json.label = $(item).text();
					json.value = target.val();
			
					array.push(json);
				}
			}
		});

		let data = $('#write-form').serializeObject();
		let json = {};

		if (typeof(data['engine-category']) == 'string') {
			$('.engine-add-card label').each((index, item) => {
				if (!$(item).attr('for').endsWith('category')) {
					json = {};
		
					json.category = 'engine';
					json.label = data['engine-category'] + ' ' + $(item).text();
					json.value = data[$(item).attr('for')];
				
					array.push(json);
				}
			});
		} else {
			for (var i=0; i<data['engine-category'].length; i++) {
				$('.engine-add-card label').each((index, item) => {
					if (index < ($('.engine-add-card label').length / data['engine-category'].length) && !$(item).attr('for').endsWith('category')) {
						json = {};
			
						json.category = 'engine';
						json.label = data['engine-category'][i] + ' ' + $(item).text();
						json.value = data[$(item).attr('for')][i];
						
						array.push(json);
					}
				});
			}
		}

		getArchiveInfo().forEach(t => {
			Object.keys(t).forEach(key => {
				json = {};
		
				json.category = 'archive';
				json.label = $('[data-field=' + key + ']').data('field');
				json.value = t[key];
		
				array.push(json);
			});
		});

		getCCInfo().forEach(t => {
			Object.keys(t).forEach(key => {
				json = {};
		
				json.category = 'cc';
				json.label = $('[data-field=' + key + ']').data('field');
				json.value = t[key];
		
				array.push(json);
			});
		});

		if (typeof(data['webwas-category']) == 'string') {
			$('.webwas-add-card label').each((index, item) => {
				if (!$(item).attr('for').endsWith('category')) {
					json = {};
		
					json.category = 'webwas';
					json.label = data['webwas-category'] + ' ' + $(item).text();
					json.value = data[$(item).attr('for')];
				
					array.push(json);
				}
			});
		} else {
			for (var i=0; i<data['webwas-category'].length; i++) {
				$('.webwas-add-card label').each((index, item) => {
					if (index < ($('.webwas-add-card label').length / data['webwas-category'].length) && !$(item).attr('for').endsWith('category')) {
						json = {};
			
						json.category = 'webwas';
						json.label = data['webwas-category'][i] + ' ' + $(item).text();
						json.value = data[$(item).attr('for')][i];
						
						array.push(json);
					}
				});
			}
		}

		if (typeof(data['db-category']) == 'string') {
			$('.db-add-card label').each((index, item) => {
				if (!$(item).attr('for').endsWith('category')) {
					json = {};
		
					json.category = 'db';
					json.label = data['db-category'] + ' ' + $(item).text();
					json.value = data[$(item).attr('for')];
				
					array.push(json);
				}
			});
		} else {
			for (var i=0; i<data['db-category'].length; i++) {
				$('.db-add-card label').each((index, item) => {
					if (index < ($('.db-add-card label').length / data['db-category'].length) && !$(item).attr('for').endsWith('category')) {
						json = {};
			
						json.category = 'db';
						json.label = data['db-category'][i] + ' ' + $(item).text();
						json.value = data[$(item).attr('for')][i];
						
						array.push(json);
					}
				});
			}
		}

		let tag = '';
		json = {};

		$('#tag-form span').each((index, item) => { tag += ($(item).text() + ", "); });

		json.category = "tag";
		json.label = "태그";
		json.value = tag.substring(0, tag.length - 2);

		array.push(json);

		Date.prototype.customFormat = function () {
			var yyyy = this.getFullYear().toString();
			var MM = pad(this.getMonth() + 1,2);
			var dd = pad(this.getDate(), 2);
			var hh = pad(this.getHours(), 2);
			var mm = pad(this.getMinutes(), 2)
			var ss = pad(this.getSeconds(), 2)

			return yyyy + MM + dd + hh + mm + ss;
		};

		let pad = function(number, length) {
			var str = '' + number;
				while (str.length < length)
				str = '0' + str;
			return str;
		}

		AjaxUtil.xhr("/downloadSiteStatus", "POST", array, ('(' + data['site-name'] + ')' + data['project-name'])  + "_" + new Date().customFormat() + ".xlsx");
	});

	$('.update-site-status').on('click', function() {
        location.href = location.href.replace('/siteStatus', '/siteStatus/update');
	});

	$('.delete-site-status').on('click', function() {
		if(confirm('사이트 현황을 삭제하시겠습니까?')) {
			AjaxUtil.ajax("/deleteSiteStatus", "POST", { 'siteIdx' : $('.site-idx').val() }, 
				function(result) {
					location.href = '/siteStatus?message=사이트 현황을 삭제했습니다.';
				},
				function(result) {
					Alert('error', '사이트 현황을 불러오는데 실패했습니다, 시스템 관리자에게 문의하세요.');
				}
			);
		}
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

// 사이트 현황 불러오기 이벤트
function getSiteStatus() {
	AjaxUtil.ajax("/getSiteStatus", "POST", { 'siteIdx' : $('.site-idx').val() }, 
		function(result) {
			let json = JSON.parse(result.siteData);

			$.each(json, (key, value) => {
				if (value != null && value != '') {
					$('#' + key).val(value);
					$('#' + key).addClass('inputted');
				}
			});

			let engineArchiveJson = json['engine-archive'];
			if (engineArchiveJson != null && engineArchiveJson.length != 0) {
				$('#engine-archive-table').bootstrapTable('append', engineArchiveJson);
				$('#engine-archive-card').addClass('inputted');
			}
				
			let engineCCJson = json['engine-cc'];
			if (engineCCJson != null && engineCCJson.length != 0) {
				$('#engine-cc-table').bootstrapTable('append', engineCCJson);
				$('#engine-cc-card').addClass('inputted');
			}

			let engineCategory = json['engine-category'];
			let engineAccess = json['engine-access'];
			let enginePort = json['engine-port'];
			let enginePath= json['engine-path'];

			if(typeof(engineCategory) == 'string') {
				addEngineInfo();

				if (engineCategory != null && engineCategory != '') {
					$('input[name=engine-category]').val(engineCategory);
					$('input[name=engine-category]').addClass('inputted');
				}

				if (engineAccess != null && engineAccess != '') {
					$('input[name=engine-access]').val(engineAccess);
					$('input[name=engine-access]').addClass('inputted');
				}

				if (enginePort != null && enginePort != '') {
					$('input[name=engine-port]').val(enginePort);
					$('input[name=engine-port]').addClass('inputted');
				}

				if (enginePath != null && enginePath != '') {
					$('input[name=engine-path]').val(enginePath);
					$('input[name=engine-path]').addClass('inputted');
				}
			} else {
				for (var i=0; i<json['engine-category'].length; i++) {
					addEngineInfo();

					if (engineCategory[i] != null && engineCategory[i] != '') {
						$('input[name=engine-category]').get(i).value = engineCategory[i];
						$('input[name=engine-category]').get(i).className += ' inputted';
					}

					if (engineAccess[i] != null && engineAccess[i] != '') {
						$('input[name=engine-access]').get(i).value = engineAccess[i];
						$('input[name=engine-access]').get(i).className += ' inputted';
					}

					if (enginePort[i] != null && enginePort[i] != '') {
						$('input[name=engine-port]').get(i).value = enginePort[i];
						$('input[name=engine-port]').get(i).className += ' inputted';
					}

					if (enginePath[i] != null && enginePath[i] != '') {
						$('input[name=engine-path]').get(i).value = enginePath[i];
						$('input[name=engine-path]').get(i).className += ' inputted';
					}
				}
			}

			let webwasCategory = json['webwas-category'];
			let webwasAdminVersion = json['webwas-admin-version'];
			let webwasAccess = json['webwas-access'];
			let webwasWebServer= json['webwas-web-server'];
			let webwasWasServer= json['webwas-was-server'];

			if (typeof(webwasCategory) == 'string') {
				addWebWasInfo();

				if (webwasCategory != null && webwasCategory != '') {
					$('input[name=webwas-category]').val(webwasCategory);
					$('input[name=webwas-category]').addClass('inputted');
				}

				if (webwasAdminVersion != null && webwasAdminVersion != '') {
					$('input[name=webwas-admin-version]').val(webwasAdminVersion);
					$('input[name=webwas-admin-version]').addClass('inputted');
				}

				if (webwasAccess != null && webwasAccess != '') {
					$('input[name=webwas-access]').val(webwasAccess);
					$('input[name=webwas-access]').addClass('inputted');
				}

				if (webwasWebServer != null && webwasWebServer != '') {
					$('input[name=webwas-web-server]').val(webwasWebServer);
					$('input[name=webwas-web-server]').addClass('inputted');
				}

				if (webwasWasServer != null && webwasWasServer != '') {
					$('input[name=webwas-was-server]').val(webwasWasServer);
					$('input[name=webwas-was-server]').addClass('inputted');
				}
			} else {
				for (var i=0; i<json['webwas-category'].length; i++) {
					addWebWasInfo();
	
					if (webwasCategory[i] != null && webwasCategory[i] != '') {
						$('input[name=webwas-category]').get(i).value = webwasCategory[i];
						$('input[name=webwas-category]').get(i).className += ' inputted';
					}
	
					if (webwasAdminVersion[i] != null && webwasAdminVersion[i] != '') {
						$('input[name=webwas-admin-version]').get(i).value = webwasAdminVersion[i];
						$('input[name=webwas-admin-version]').get(i).className += ' inputted';
					}
	
					if (webwasAccess[i] != null && webwasAccess[i] != '') {
						$('input[name=webwas-access]').get(i).value = webwasAccess[i];
						$('input[name=webwas-access]').get(i).className += ' inputted';
					}
	
					if (webwasWebServer[i] != null && webwasWebServer[i] != '') {
						$('input[name=webwas-web-server]').get(i).value = webwasWebServer[i];
						$('input[name=webwas-web-server]').get(i).className += ' inputted';
					}
	
					if (webwasWasServer[i] != null && webwasWasServer[i] != '') {
						$('input[name=webwas-was-server]').get(i).value = webwasWasServer[i];
						$('input[name=webwas-was-server]').get(i).className += ' inputted';
					}
				}
			}
			
			let dbCategory = json['db-category'];
			let dbType = json['db-type'];
			let dbVersion = json['db-version'];
			let dbComposition = json['db-composition'];
			let dbAddress = json['db-address'];
			let dbUser = json['db-user'];
			let dbPw = json['db-pw'];
			let dbName = json['db-name'];
			let dbPort = json['db-port'];

			if (typeof(dbCategory) == 'string') {
				addDbInfo();

				if (dbCategory != null && dbCategory != '') {
					$('input[name=db-category]').val(dbCategory);
					$('input[name=db-category]').addClass('inputted');
				}

				if (dbType != null && dbType != '') {
					$('input[name=db-type]').val(dbType);
					$('input[name=db-type]').addClass('inputted');
				}

				if (dbVersion != null && dbVersion != '') {
					$('input[name=db-version]').val(dbVersion);
					$('input[name=db-version]').addClass('inputted');
				}

				if (dbComposition != null && dbComposition != '') {
					$('input[name=db-composition]').val(dbComposition);
					$('input[name=db-composition]').addClass('inputted');
				}

				if (dbAddress != null && dbAddress != '') {
					$('input[name=db-address]').val(dbAddress);
					$('input[name=db-address]').addClass('inputted');
				}

				if (dbUser != null && dbUser != '') {
					$('input[name=db-user]').val(dbUser);
					$('input[name=db-user]').addClass('inputted');
				}

				if (dbPw != null && dbPw != '') {
					$('input[name=db-pw]').val(dbPw);
					$('input[name=db-pw]').addClass('inputted');
				}

				if (dbName != null && dbName != '') {
					$('input[name=db-name]').val(dbName);
					$('input[name=db-name]').addClass('inputted');
				}

				if (dbPort != null && dbPort != '') {
					$('input[name=db-port]').val(dbPort);
					$('input[name=db-port]').addClass('inputted');
				}
			} else {
				for (var i=0; i<json['db-category'].length; i++) {
					addDbInfo();
	
					if (dbCategory[i] != null && dbCategory[i] != '') {
						$('input[name=db-category]').get(i).value = dbCategory[i];
						$('input[name=db-category]').get(i).className += ' inputted';
					}
	
					if (dbType[i] != null && dbType[i] != '') {
						$('input[name=db-type]').get(i).value = dbType[i];
						$('input[name=db-type]').get(i).className += ' inputted';
					}
	
					if (dbVersion[i] != null && dbVersion[i] != '') {
						$('input[name=db-version]').get(i).value = dbVersion[i];
						$('input[name=db-version]').get(i).className += ' inputted';
					}
	
					if (dbComposition[i] != null && dbComposition[i] != '') {
						$('input[name=db-composition]').get(i).value = dbComposition[i];
						$('input[name=db-composition]').get(i).className += ' inputted';
					}
	
					if (dbAddress[i] != null && dbAddress[i] != '') {
						$('input[name=db-address]').get(i).value = dbAddress[i];
						$('input[name=db-address]').get(i).className += ' inputted';
					}
	
					if (dbUser[i] != null && dbUser[i] != '') {
						$('input[name=db-user]').get(i).value = dbUser[i];
						$('input[name=db-user]').get(i).className += ' inputted';
					}
	
					if (dbPw[i] != null && dbPw[i] != '') {
						$('input[name=db-pw]').get(i).value = dbPw[i];
						$('input[name=db-pw]').get(i).className += ' inputted';
					}
	
					if (dbName[i] != null && dbName[i] != '') {
						$('input[name=db-name]').get(i).value = dbName[i];
						$('input[name=db-name]').get(i).className += ' inputted';
					}
	
					if (dbPort[i] != null && dbPort[i] != '') {
						$('input[name=db-port]').get(i).value = dbPort[i];
						$('input[name=db-port]').get(i).className += ' inputted';
					}
				}
			}

			let tagList = result['tagList'];
			tagList.forEach(t => {
				$('<span>', {
					'class'		: 'badge text-bg-dark me-1',
					'name'		: 'tag-item',
					'data-color': t.colorCode,
					'style'		: 'background-color: #' + t.colorCode + '!important',
					'role'		: 'button',
					'text'		: t.tagName
				}).appendTo($('#tag-form .card-body'));
			});
		},
		function(result) {
            Alert('error', '사이트 현황을 불러오는데 실패했습니다, 시스템 관리자에게 문의하세요.');
		}
	);
}

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
		columns: [ {field: 'archive', title:'Archive(BaseDir)', align: 'center'}, {field: 'volume', title:'Volume', align: 'center'}, {field: 'physical', title:'physical', align: 'center'}, {field: 'fileSystemKB', title: 'FileSystemKB', align: 'center'}, {field: 'maxSpace', title: 'Max Space', align: 'center'}, {field: 'usableSpace', title: 'Usable Space', align: 'center'}],
		data: [],
		showHeader: true,
		classes: 'table'
	});
}

// 라이프사이클 테이블을 초기화한다.
function initializeContentClassTable() {
	$('#engine-cc-table').bootstrapTable({
		pagination: false,
		columns: [ {field: 'contentClass', title:'Content Class', align: 'center'}, {field: 'contentState', title:'Content State', align: 'center'}, {field: 'stateLocation', title:'State Location', align: 'center'} ],
		data: [],
		showHeader: true,
		classes: 'table'
	});
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

function getArchiveInfo() {
	return $('#engine-archive-table').bootstrapTable('getData');
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
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="engine-category" class="fw-bold">엔진 구분</label>';
	html += '					<input class="form-control" name="engine-category" type="text" data-default="운영" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="engine-port" class="fw-bold">엔진 Port</label>';
	html += '					<input class="form-control" name="engine-port" type="number" data-default="2102" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-12 mb-3">';
	html += '					<label for="engine-access" class="fw-bold">접속 정보 (IP / Domain)</label>';
	html += '					<input class="form-control" name="engine-access" type="text" data-default="127.0.0.1 / ecm.domain.com" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-12 mb-3">';
	html += '					<label for="engine-path" class="fw-bold">엔진 설치 경로</label>';
	html += '					<input class="form-control" name="engine-path" type="text" data-default="/app/xtorm" readonly />';
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
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="webwas-category" class="fw-bold">서버 구분</label>';
	html += '					<input class="form-control" name="webwas-category" type="text" data-default="운영" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="webwas-admin-version" class="fw-bold">웹 관리자 버전</label>';
	html += '					<input class="form-control" name="webwas-admin-version" type="text" data-default="구 웹 관리자" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-12 mb-3">';
	html += '					<label for="webwas-access" class="fw-bold">접속 정보</label>';
	html += '					<input class="form-control" name="webwas-access" type="text" data-default="http://127.0.0.1:9102/xtorm/index.jsp" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="webwas-web-server" class="fw-bold">WEB Server</label>';
	html += '					<input class="form-control" name="webwas-web-server" type="text" data-default="WebToB 5" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="webwas-was-server" class="fw-bold">WAS Server</label>';
	html += '					<input class="form-control" name="webwas-was-server" type="text" data-default="Jeus 8.5" readonly />';
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
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-category" class="fw-bold">DB 서버 구분</label>';
	html += '					<input class="form-control" name="db-category" type="text" data-default="운영" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-type" class="fw-bold">DB 종류</label>';
	html += '					<input class="form-control" name="db-type" type="text" data-default="Oracle" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-version" class="fw-bold">DB 버전</label>';
	html += '					<input class="form-control" name="db-version" type="text" data-default="Oracle 19c" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-composition" class="fw-bold">엔진 구성 방식</label>';
	html += '					<input class="form-control" name="db-composition" type="text" data-default="Stand Alone" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-12 mb-3">';
	html += '					<label for="db-address" class="fw-bold">DB 주소 (Domain)</label>';
	html += '					<input class="form-control" name="db-address" type="text" data-default="127.0.0.1" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-user" class="fw-bold">DB User 및 권한</label>';
	html += '					<input class="form-control" name="db-user" type="text" data-default="XTORM (Select, Delete, Update 권한)" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-pw" class="fw-bold">DB 패스워드 및 암호화 여부</label>';
	html += '					<input class="form-control" name="db-pw" type="text" data-default="XTORM (Xtorm 자체 암호화 적용)" readonly />';
	html += '				</div>';
	html += '';
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-name" class="fw-bold">DB SID or Service name or Database 명</label>';
	html += '					<input class="form-control" name="db-name" type="text" data-default="XTORM" readonly />';
	html += '				</div>';
	html += '';	
	html += '				<div class="col-12 col-sm-6 mb-3">';
	html += '					<label for="db-port" class="fw-bold">DB Port</label>';
	html += '					<input class="form-control" name="db-port" type="text" data-default="1521" readonly />';
	html += '				</div>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';

	$('#db>.card-body>.row').append(html);
}