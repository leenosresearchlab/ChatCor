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

import com.chatcor.biz.svc.BertService;
import com.chatcor.biz.svc.EntityService;
import com.chatcor.biz.svc.IntentService;
import com.chatcor.biz.svc.MainService;
import com.chatcor.biz.svc.SentenceService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping("/biz")
public class BizController {

    private static Logger logger = LoggerFactory.getLogger(BizController.class);

    @Autowired
    public MainService mainService;

    @Autowired
    public SentenceService sentenceService;

    @Autowired
    public IntentService intentService;

    @Autowired
    public EntityService entityService;
    
    @Autowired
    public BertService bertService;

    @RequestMapping(value = "/new-project", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> createProject(@RequestBody String strFrmData) throws Exception {
        logger.info(strFrmData);
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strFrmData, LinkedHashMap.class);
        return mainService.createProject(map);
    }
    
    @RequestMapping(value = "/new-bertproject", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> createBertProject(@RequestBody String strFrmData) throws Exception {
        logger.info(strFrmData);
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strFrmData, LinkedHashMap.class);
        return mainService.createBertProject(map);
    }
    

    @RequestMapping(value = "/has-project/{name}", method = RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public String hasProject(@PathVariable("name") String name) throws Exception {
        logger.info(name);
        return Boolean.toString(mainService.hasProject(name));
    }

    @RequestMapping(value = "/del-project/{name}", method = RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public String removeProject(@PathVariable("name") String name) throws Exception {
        logger.info(name);
        return Boolean.toString(mainService.removeProject(name));
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

    @RequestMapping(value = "/del-predicate", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> removePredicate(@RequestBody String strFrmData) throws Exception {
        logger.info(strFrmData);
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strFrmData, LinkedHashMap.class);
        logger.debug(map.toString());
        return mainService.removePredicate(map);
    }

    @RequestMapping(value = "/mod-predicate", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> modifyPredicate(@RequestBody String strFrmData) throws Exception {
        logger.info(strFrmData);
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> predicate = mapper.readValue(strFrmData, LinkedHashMap.class);
        return mainService.modifyPredicate(predicate);
    }

    @RequestMapping(value = "/has-predicate", method = RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public String hasPredicate(@RequestBody String strFrmData) throws Exception {
        logger.info(strFrmData);
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> predicate = mapper.readValue(strFrmData, LinkedHashMap.class);
        return Boolean.toString(mainService.hasPredicate(predicate));
    }

    @RequestMapping(value = "/list-sentence/{prjName}", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, List<Object>> getSentences(@PathVariable("prjName") String prjName) throws Exception {
        logger.info(prjName);
        return sentenceService.getSentences(prjName);
    }

    @RequestMapping(value = "/modify-sentence", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> modifySentence(@RequestBody String strSentence) throws Exception {
        logger.info("{}", strSentence);
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strSentence, LinkedHashMap.class);
        logger.debug("{}", map);
        return sentenceService.modifySentence(map);
    }

    @RequestMapping(value = "/export-sentence", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> exportSentence(@RequestBody String strSentence) throws Exception {
        logger.info("{}", strSentence);
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strSentence, LinkedHashMap.class);
        logger.debug("{}", map);
        return sentenceService.exportSentence(map);
    }

    @RequestMapping(value = "/list-entries/{prjName}", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> listEntries(@PathVariable("prjName") String prjName) throws Exception {
        logger.info(prjName);
        return entityService.listEntries(prjName);
    }

    @RequestMapping(value = "/sel-entries/", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getEntries(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> param = mapper.readValue(strParam, LinkedHashMap.class);
        logger.debug("{}", param);
        return entityService.getEntries(param);
    }

    @RequestMapping(value = "/sel-entities/", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getEntities(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> param = mapper.readValue(strParam, LinkedHashMap.class);
        return entityService.getEntities(param);
    }

    @RequestMapping(value = "/add-entities/", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> addEntities(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> param = mapper.readValue(strParam, LinkedHashMap.class);
        return entityService.addEntities(param);
    }

    @RequestMapping(value = "/del-entries/", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> delEntityEntries(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> param = mapper.readValue(strParam, LinkedHashMap.class);
        return entityService.delEntityEntries(param);
    }

    @RequestMapping(value = "/add-entry/", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> addEntry(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> param = mapper.readValue(strParam, LinkedHashMap.class);
        return entityService.addEntry(param);
    }

    @RequestMapping(value = "/new-entityfile/", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> createEntity(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> param = mapper.readValue(strParam, LinkedHashMap.class);
        return entityService.createEntity(param);
    }

    @RequestMapping(value = "/list-intents/{prjName}", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> listIntents(@PathVariable("prjName") String prjName) throws Exception {
        logger.info(prjName);
        return intentService.listIntents(prjName);
    }

    @RequestMapping(value = "/has-intent", method = RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public String hasIntent(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return Boolean.toString(intentService.hasIntent(map));
    }

    @RequestMapping(value = "/new-intent", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> createIntent(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return intentService.createIntent(map);
    }

    @RequestMapping(value = "/add-intent", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> addIntent(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return intentService.addIntent(map);
    }

    @RequestMapping(value = "/del-intent", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> delIntent(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return intentService.rebuildIntents(map);
    }

    @RequestMapping(value = "/mod-intent", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> modIntent(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return intentService.rebuildIntents(map);
    }

    @RequestMapping(value = "/valid-intent", method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String, Object>> validIntent(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return intentService.validIntent(map);
    }

    @RequestMapping(value = "/sel-intents", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getIntents(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return intentService.getIntents(map);
    }
    
    @RequestMapping(value = "/get-bertProject", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getBertProject(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return bertService.getBertProject(map);
    }
    
    @RequestMapping(value = "/get-bertFile", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> getBertFile(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return bertService.getBertFile(map);
    }
    
    @RequestMapping(value = "/save-bertFile", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> saveBertFile(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return bertService.saveBertFile(map);
    }
    
    @RequestMapping(value = "/change-version", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> changeVersion(@RequestBody String strParam) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(strParam, LinkedHashMap.class);
        return bertService.changeVersion(map);
    }
}
