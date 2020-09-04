package com.chatcor.biz;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/")
public class IndexController {

    private static Logger logger = LoggerFactory.getLogger(IndexController.class);

    @GetMapping
    public ModelAndView index() throws Exception {
        logger.info("index");
        ModelAndView mav = new ModelAndView();
        // XXX: model map 설정 예시
        // mav.addObject("status", "Check to user login");
        mav.setViewName("index");
        return mav;
    }
}