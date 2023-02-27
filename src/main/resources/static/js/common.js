let AjaxUtil = {
    ajax: function ($url, $type, $data, $success, $error, $async) {
        let $json = ($data) ? JSON.stringify($data) : "";
        let $asyncOpt = ($async) ? true : false;

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: $url,
            type: $type,
            async: $asyncOpt,
            beforeSend: function () {
                $('.wrap-loading').removeClass('d-none');
            },
            complete: function () {
                $('.wrap-loading').addClass('d-none');
            },
            dataType: 'json',
            data: $json,
            contentType: 'application/json;charset=UTF-8',
            mimeType: 'application/json',
            success: function (response, textStatus) {
                if (textStatus == "success")
                    $success(response);
                else if (response.status == "403")
                    window.location.href("/signin");
                else
                    $error(response);
            },
            error: function (response) {
                if (response.status == "200")
                    $success(response);
                else if (response.status == "403")
                    window.location.href("/signin");
                else
                    $error(response);
            }
        });
    },

    formData: function ($url, $data, $function) {
        $.ajax({
            url: $url,
            type: 'POST',
            data: $data,
            encType: 'multipart/form-data',
            async: false,
            beforeSend: function () {
                $('.wrap-loading').removeClass('d-none');
            },
            complete: function () {
                $('.wrap-loading').addClass('d-none');
            },
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status == "403")
                    window.location.href("/signin");
                else
                    $function(response);
            },
            error: function (response) {
                if (response.status == "403")
                    window.location.href("/signin");
                else
                    $function(response);
            }
        });
    },

    xhr: function ($url, $type, $data, $fileName) {
        $('.wrap-loading').removeClass('d-none');

        let $json = ($data) ? JSON.stringify($data) : "";

        let xhr = new XMLHttpRequest();
        xhr.open($type, $url, true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Accept", "application/json;charset=UTF-8");
        xhr.responseType = "blob";

        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                let contentType = xhr.getResponseHeader("content-type");

                if (contentType.indexOf("application/json") != 0) {
                    let blob = new Blob([this.response], {type: contentType})

                    if (window.navigator && window.navigator.msSaveBlob) {
                        window.navigator.msSaveOrOpenBlob(blob, $fileName);
                    } else {
                        let URL = window.URL || window.webkitURL;
                        let downloadUrl = URL.createObjectURL(blob);

                        let link = document.createElement("a");
                        link.href = downloadUrl;
                        link.download = $fileName;
                        link.click();
                    }
                } else {
                    let blob = new Blob([this.response], {type: 'application/json'})

                    blob.text().then(function (result) {
                        alert(result.responseText);
                    });
                }
            }

            $('.wrap-loading').addClass('d-none');
        };
        xhr.send($json);
    }
};

let Alert = function ($type, $message) {
    if ($('.alert').length != 0)
        $('.alert').remove();

    $('<div>', {
        'class': 'alert custom-alert alert-dismissible fade show d-flex align-items-center',
        'role': 'alert'
    }).appendTo(document.body);

    if ($type) {
        if ($type == 'success') {
            $('.alert').append('<svg class="bi flex-shrink-0 me-2" role="img" aria-label="Success:"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>');
            $('.alert').addClass('alert-success');
        } else if ($type == 'error') {
            $('.alert').append('<svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>');
            $('.alert').addClass('alert-danger');
        } else {
            $('.alert').append('<svg class="bi flex-shrink-0 me-2" role="img" aria-label="Info:"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>');
            $('.alert').addClass('alert-primary');
        }
    } else {
        return false;
    }

    $('<strong>', {
        'text': $message
    }).appendTo($('.alert'));

    $('<button>', {
        'class': 'btn-close',
        'type': 'button',
        'data-bs-dismiss': 'alert',
        'aria-label': 'Close'
    }).appendTo($('.alert'));

    $(".custom-alert").fadeTo(2000, 500).fadeOut(500, function () {
        $(".custom-alert").remove();
    });
};

$.fn.serializeObject = function () {
    let result = {};
    let extend = function ($i, $element) {
        let node = result[$element.name];
        if ("undefined" !== typeof node && node !== null) {
            if ($.isArray(node))
                node.push($element.value);
            else
                result[$element.name] = [node, $element.value];
        } else
            result[$element.name] = $element.value;
    };

    $.each(this.serializeArray(), extend);

    return result;
};

/* 파일 크기 변환 */
function convertFileSize(fileSize) {
    var retFormat = "0";
    var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(fileSize) / Math.log(1024));

    if (fileSize != 0) {
        retFormat = (fileSize / Math.pow(1024, e)).toFixed(2) + " " + s[e];
    } else {
        retFormat = fileSize + " " + s[0];
    }

    return retFormat;
}

function getCurrentUser() {
    let userId;

    AjaxUtil.ajax('/user/select', 'POST', null,
        function (result) {
            userId = result.responseText;
        },
        function (result) {
            Alert('error', '유저 아이디 조회 실패');
        }
    );

    return userId;
}