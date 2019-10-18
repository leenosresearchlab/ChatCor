package com.chatcor.biz;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chatcor.biz.svc.MainService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping("/biz")
public class BizController {

    private static Logger logger = LoggerFactory.getLogger(BizController.class);

    @Autowired
    public MainService mainService;

    @RequestMapping(value = "/new-project", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> createProject(@RequestBody String strFrmData) throws Exception {
        logger.info(strFrmData);
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strFrmData, LinkedHashMap.class);
        return mainService.createProject(map);
    }

    @RequestMapping(value = "/has-project/{name}", method = RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public String hasProject(@PathVariable("name") String name) throws Exception {
        logger.info(name);
        return Boolean.toString(mainService.hasProject(name));
    }

    @RequestMapping(value = "/predicates/{name}", method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String, Object>> getPredicates(@PathVariable("name") String name) throws Exception {
        logger.info(name);
        return mainService.getPredicates(name);
    }

    @RequestMapping(value = "/new-predicate", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> createPredicate(@RequestBody String strFrmData) throws Exception {
        logger.info(strFrmData);
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strFrmData, LinkedHashMap.class);
        logger.debug(map.toString());
        return mainService.createPredicate(map);
    }

    @RequestMapping(value = "/list-sentence/{prjName}", method = RequestMethod.POST)
    @ResponseBody
    public  Map<String, List<Object>> getSentences(@PathVariable("prjName") String prjName) throws Exception {
        logger.info(prjName);
        return mainService.getSentences(prjName);
    }

}
