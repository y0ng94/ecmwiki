$(function () {
	initializeMenu();

	$("#total-search").focus(function () {
		$(".close-btn").addClass("active");
	});

	$("#total-search").focusout(function () {
		$(".close-btn").removeClass("active");
		$(this).val("");
	});

	$('.user-top-picture').on('click', function() {
		$('#menu').removeClass('show');
		$('.search-container').removeClass('show');

		if ($('.card-container').hasClass('show'))
			$('.card-container').removeClass('show');
		else
			$('.card-container').addClass('show');
	});

	$('#total-menu-toggle').on('click', function() {
		$('.card-container').removeClass('show');
		$('.search-container').removeClass('show');

		if ($('#menu').hasClass('show'))
			$('#menu').removeClass('show');
		else
			$('#menu').addClass('show');
	});

	$('#total-search-toggle').on('click', function() {
		$('.card-container').removeClass('show');
		$('#menu').removeClass('show');

		if ($('.search-container').hasClass('show'))
			$('.search-container').removeClass('show');
		else
			$('.search-container').addClass('show');
	});

	$('#total-search').on('keypress', function(e) {
		if (e.which === 13)  { doTotalSearch(); }
	});
});

// Header 메뉴 초기화 함수
function initializeMenu() {
	AjaxUtil.ajax('/getMenu', 'GET', null,
		function (result) {
			let main_menu = result.filter(item => item.targetMenu == null).sort(function (a, b) {
				return a.menuOrder - b.menuOrder;
			}).map(element => {
				return appendMainMenu(element);
			});

			for (var i = 0; i < main_menu.length; i++) {
				result.filter(item => item.targetMenu == main_menu[i].menu).sort(function (a, b) {
					return a.menuOrder - b.menuOrder;
				}).forEach(element => {
					appendSubMenu(main_menu[i].target, element);
				});
			}
		},
		function (result) {
			Alert('error', '메뉴 항목을 가져오는데 실패했습니다. 시스템 관리자에게 문의하세요.');

			console.log(result);
		}
	);
}

// 메인 메뉴 추가 함수
function appendMainMenu($data) {
	let dropdown_item = $('<div>', {
				'class': 'dropdown'
			}).appendTo($('#menu'));

	$('<button>', {
		'class': 'dropdown-btn text-truncate',
		'id': $data.menuId,
		'text': $data.menuName
	}).appendTo(dropdown_item);

	$('<button>', {
		'class': 'dropdown-cover'
	}).appendTo(dropdown_item);

	return {
		'menu': $data.menuId,
		'target': $('<div>', {
			class: 'dropdown-content'
		}).appendTo(dropdown_item)
	}
}

// 서브 메뉴 추가 함수
function appendSubMenu($target, $data) {
	var cls = '';

	if ($data.boardRegistDate != null && $data.boardRegistDate != undefined) {
		var now = new Date();
		var currentDate = new Date(now.setDate(now.getDate() - 1));
		var boardLastRegistDate = new Date($data.boardRegistDate.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, '$1-$2-$3 $4:$5:$6'));

		cls = (currentDate <= boardLastRegistDate) ? 'new' : '';
	}

	$('<a>', {
		href: ($data.linkUrl) ? $data.linkUrl : '#',
		text: $data.menuName,
		class: cls
	}).appendTo($target);
}

// 개인 메뉴 추가 함수
function appendPersonalMenu($data) {
	let nav_item = $('<li>', {
		'class': 'nav-item'
	}).appendTo($('#navbarPersonalCollapse ul'));

	let a_item = $('<a>', {
		'class': 'nav-link px-3',
		'href': ($data.linkUrl) ? $data.linkUrl : '#'
	}).appendTo(nav_item);

	$('<i>', {
		'class': $data.menuIcon + " mx-2"
	}).appendTo(a_item);

	$('<span>', {
		'text': $data.menuName
	}).appendTo(a_item);
}

// 통합검색
function doTotalSearch() {
	location.href = '/total/' + $('#total-search').val();
}