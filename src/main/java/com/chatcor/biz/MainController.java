package com.chatcor.biz;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chatcor.biz.model.DataCommand;
import com.chatcor.biz.svc.MainService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping("/main")
public class MainController {

    private static Logger logger = LoggerFactory.getLogger(BizController.class);

    @Autowired
    public MainService mainService;

    @RequestMapping(value = "/navi")
    public String loadPage(String viewName) throws Exception {
        logger.info(viewName);
        return viewName;
    }

    @RequestMapping(value = "/projects", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, List<Object>> getProjectList() throws Exception {
        return mainService.getProjectMap();
    }

    @RequestMapping(value = "/make-data", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> makeProjectData(@RequestBody String strFrmData) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strFrmData, LinkedHashMap.class);
        return mainService.makeProjectData(map);
    }

    @RequestMapping(value = "/upload-data", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public Map<String, Object> uploadData(DataCommand model) throws Exception {
        logger.debug(model.toString());
        return mainService.uploadDataFile(model);
    }

    @RequestMapping(value = "/project-infos", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, List<Object>> getProjectInfos() throws Exception {
        return mainService.getProjectInfos();
    }

}
