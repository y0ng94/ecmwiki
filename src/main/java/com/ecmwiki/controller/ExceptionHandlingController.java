package com.ecmwiki.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@Controller
public class ExceptionHandlingController implements ErrorController {

    private final String ERROR_404_PAGE_PATH = "view/error/404";
    private final String ERROR_500_PAGE_PATH = "view/error/500";
    private final String ERROR_ETC_PAGE_PATH = "view/error/unknown";

    /**
     * 에러 페이지 핸들러
     *
     * @param request
     * @param model
     * @return errorPage
     */
    @RequestMapping(value = "/error")
    public String handleError(HttpServletRequest request, Model model) {

        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            int statusCode = Integer.valueOf(status.toString());

            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                return ERROR_404_PAGE_PATH;
            }

            if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                return ERROR_500_PAGE_PATH;
            }
        }

        return ERROR_ETC_PAGE_PATH;
    }
}