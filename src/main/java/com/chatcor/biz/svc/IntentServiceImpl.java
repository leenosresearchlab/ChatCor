/**
 * 
 */
package com.chatcor.biz.svc;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.io.filefilter.NotFileFilter;
import org.apache.commons.io.filefilter.TrueFileFilter;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chatcor.core.BaseService;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * (파일 시스템 기반) Intent 학습문장 편집 기능 처리 기능 처리 Serive 클래스
 * 
 * @author Lewis
 *
 */
@Service("intentService")
public class IntentServiceImpl extends BaseService implements IntentService {

    @Autowired
    public MainService mainService;

    @Override
    public Map<String, Object> listIntents(String prjName) throws Exception {
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("result", true);
        IOFileFilter filter =  new NotFileFilter(new WildcardFileFilter("*".concat(SUFFIX_INTENTS).concat("*")));
        Iterator<File> iter = FileUtils.iterateFiles(Paths.get(projectRoot, prjName, intentWork).toFile(), filter, TrueFileFilter.INSTANCE);
        List<String> files = new ArrayList<String>();
        while (iter.hasNext()) {
            files.add(iter.next().getName());
        }
        result.put("intent_files", files);
        return result;
    }

    @Override
    public boolean hasIntent(Map<String, Object> map) throws Exception {
        logger.debug("{}", map);
        File intentJson = Paths.get(projectRoot, map.get("project_id").toString(), intentWork, map.get("intent_name").toString().concat(SUFFIX_JSON)).toFile();
        return intentJson.exists();
    }

    @Override
    public Map<String, Object> createIntent(Map<String, Object> map) throws Exception {
        logger.debug("{}", map);
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("result", true);
        File intentJson = Paths.get(projectRoot, map.get("project_id").toString(), intentWork, map.get("intent_name").toString().concat(SUFFIX_JSON)).toFile();
        File usersayJson = Paths.get(projectRoot, map.get("project_id").toString(), intentWork, map.get("intent_name").toString().concat(SUFFIX_INTENTS).concat(SUFFIX_JSON)).toFile();
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        objectMapper.writeValue(intentJson, map.get("intent_obj"));
        objectMapper.writeValue(usersayJson, map.get("usersay_list"));
        return result;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Override
    public List<Map<String, Object>> validIntent(Map<String, Object> map) throws Exception {
        logger.debug("{}", map);
        List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
        List<Map<String, Object>> predicates = mainService.getPredicates(map.get("project_id").toString());
        List<Map> lstIntent = (List<Map>) map.get("intent_list");
        for (Map mapIntent : lstIntent) {
            Map<String, Object> mapValid = new LinkedHashMap<String, Object>();
            mapValid.put("intent", mapIntent.get("intent"));
            List<Map<String, Object>> lstValid = new ArrayList<Map<String, Object>>();
            int count = 0;
            List<String> list = (ArrayList<String>) mapIntent.get("predicates");
            for (String prdName : list) {
                Map<String, Object> valid = new LinkedHashMap<String, Object>();
                valid.put("value", prdName);
                Boolean boolPedicate = hasPredicate(prdName, predicates);
                valid.put("exists", boolPedicate);
                if (!boolPedicate.booleanValue()) {
                    count ++;
                }
                lstValid.add(valid);
            }
            mapValid.put("status", count == 0);
            mapValid.put("valid_list", lstValid);
            result.add(mapValid);
        }
        return result;
    }
    @SuppressWarnings({ "rawtypes", "unchecked" })
    @Override
    public Map<String, Object> getIntents(Map<String, Object> map) throws Exception {
        logger.debug("{}", map);
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        List<Map> list = null;
        File file = Paths.get(projectRoot, map.get("project_id").toString(), intentWork, map.get("intent_id").toString().concat(SUFFIX_INTENTS).concat(SUFFIX_JSON)).toFile();
        try {
            list = mapper.readValue(file, List.class);
        } catch (JsonMappingException je) {
            InputStreamReader is = new InputStreamReader(new FileInputStream(file), "EUC-KR");
            list = mapper.readValue(is, List.class);
        }
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("result", true);
        result.put("intent_id", map.get("intent_id"));
        List<String> intentList = new ArrayList<String>();
        for (Map imap : list) {
            List<Map> lstData = (ArrayList<Map>) imap.get("data");
            StringBuilder sbIntent = new StringBuilder();
            for (Map dmap : lstData) {
                sbIntent.append(dmap.get("text"));
            }
            intentList.add(sbIntent.toString());
        }
        result.put("intent_list", intentList);
        return result;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Override
    public Map<String, Object> addIntent(Map<String, Object> map) throws Exception {
        logger.debug("{}", map);
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        List<Map> listUsersay = null;
        File file = Paths.get(projectRoot, map.get("project_id").toString(), intentWork, map.get("intent_id").toString().concat(SUFFIX_INTENTS).concat(SUFFIX_JSON)).toFile();
        try {
            listUsersay = mapper.readValue(file, List.class);
        } catch (JsonMappingException je) {
            InputStreamReader is = new InputStreamReader(new FileInputStream(file), "EUC-KR");
            listUsersay = mapper.readValue(is, List.class);
        }
        logger.debug("{}", listUsersay);
        listUsersay.add((Map) map.get("usersay"));
        mapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        mapper.writeValue(file, listUsersay);
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("result", true);
        result.put("intent_id", map.get("intent_id"));
        result.put("user_content", map.get("user_content"));
        return result;
    }

    private Boolean hasPredicate(String predicateName, List<Map<String, Object>> predicates) throws Exception {
        boolean result = false;
        for (Map<String, Object> map : predicates) {
            if (StringUtils.equals(predicateName, map.get("predicate_name").toString())) {
                result = true;
                break;
            }
        }
        return Boolean.valueOf(result);
    }

    @Override
    public Map<String, Object> rebuildIntents(Map<String, Object> map) throws Exception {
        logger.debug("{}", map);
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("result", true);
        File usersayJson = Paths.get(projectRoot, map.get("project_id").toString(), intentWork, map.get("intent_id").toString().concat(SUFFIX_INTENTS).concat(SUFFIX_JSON)).toFile();
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        objectMapper.writeValue(usersayJson, map.get("usersay_list"));
        return result;
    }
}
