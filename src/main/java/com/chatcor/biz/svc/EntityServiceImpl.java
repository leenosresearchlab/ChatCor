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
import org.apache.commons.io.filefilter.TrueFileFilter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.chatcor.core.BaseService;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * 엔트리 / 엔티티 편집 기능 처리 Serive 클래스 (Entry & Entity)
 * 
 * @author Lewis
 *
 */
@Service("entityService")
public class EntityServiceImpl extends BaseService implements EntityService {

    @Override
    public Map<String, Object> listEntries(String prjName) throws Exception {
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("result", true);
        Iterator<File> iter = FileUtils.iterateFiles(Paths.get(projectRoot, prjName, entry).toFile(), TrueFileFilter.INSTANCE, TrueFileFilter.INSTANCE);
        List<String> files = new ArrayList<String>();
        while (iter.hasNext()) {
            files.add(iter.next().getName());
        }
        result.put("entries", files);
        iter = FileUtils.iterateFiles(Paths.get(projectRoot, prjName, entity).toFile(), TrueFileFilter.INSTANCE, TrueFileFilter.INSTANCE);
        files = new ArrayList<String>();
        while (iter.hasNext()) {
            String fileName = iter.next().getName();
            if (!StringUtils.contains(fileName, SUFFIX_ENTRIES)) {
                files.add(fileName);
            }
        }
        result.put("entities", files);
        return result;
    }

    @Override
    public Map<String, Object> getEntries(Map<String, Object> param) throws Exception {
        logger.debug("{}", param);
        String contents = FileUtils.readFileToString(Paths.get(projectRoot, param.get("project_id").toString(), entry, param.get("file_name").toString()).toFile(), txtEncoding);
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("result", true);
        result.put("entries", StringUtils.split(contents, "\n"));
        return result;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Map<String, Object> getEntities(Map<String, Object> param) throws Exception {
        logger.debug("{}", param);
        String contFileName = param.get("entity_id").toString().concat(SUFFIX_ENTRIES).concat(SUFFIX_JSON);
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        File file = Paths.get(projectRoot, param.get("project_id").toString(),  entity, contFileName).toFile();
        List list = null;
        try {
            list = mapper.readValue(file, List.class);
        } catch (JsonMappingException je) {
            InputStreamReader is = new InputStreamReader(new FileInputStream(file), "EUC-KR");
            list = mapper.readValue(is, List.class);
        }
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("result", true);
        result.put("entities", list);
        return result;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Override
    public Map<String, Object> addEntities(Map<String, Object> param) throws Exception {
        logger.debug("{}", param);
        Map<String, Object> map = getEntities(param);
        List<Object> entities = (ArrayList<Object>) map.get("entities");
        entities.addAll(((List) param.get("entities")));
        String contFileName = param.get("entity_id").toString().concat(SUFFIX_ENTRIES).concat(SUFFIX_JSON);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        objectMapper.writeValue(Paths.get(projectRoot, param.get("project_id").toString(),  entity, contFileName).toFile(), entities);
        return map;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Override
    public Map<String, Object> delEntityEntries(Map<String, Object> param) throws Exception {
        logger.debug("param: {}", param);
        Map<String, Object> map = getEntities(param);
        List<Map> entities = (ArrayList<Map>) getEntities(param).get("entities");
        for (Map entity : entities) {
            if (StringUtils.equals(entity.get("value").toString(), param.get("entity_value").toString())) {
                entity.replace("synonyms", param.get("synonyms"));
                break;
            }
        }
        map.replace("entities", entities);
        String contFileName = param.get("entity_id").toString().concat(SUFFIX_ENTRIES).concat(SUFFIX_JSON);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        objectMapper.writeValue(Paths.get(projectRoot, param.get("project_id").toString(),  entity, contFileName).toFile(), entities);
        return map;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Override
    public Map<String, Object> addEntry(Map<String, Object> param) throws Exception {
        logger.debug("{}", param);
        Map<String, Object> map = getEntities(param);
        List<Map> entities = (ArrayList<Map>) getEntities(param).get("entities");
        for (Map entity : entities) {
            if (StringUtils.equals(entity.get("value").toString(), param.get("entity_value").toString())) {
                ((List) entity.get("synonyms")).addAll((List) param.get("entry"));
                break;
            }
        }
        map.replace("entities", entities);
        String contFileName = param.get("entity_id").toString().concat(SUFFIX_ENTRIES).concat(SUFFIX_JSON);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        objectMapper.writeValue(Paths.get(projectRoot, param.get("project_id").toString(),  entity, contFileName).toFile(), entities);
        return map;
    }

    @Override
    public Map<String, Object> createEntity(Map<String, Object> param) throws Exception {
        logger.debug("param : {}", param);
        File entityJson = Paths.get(projectRoot, param.get("project_id").toString(), entity, param.get("entity_fileName").toString().concat(SUFFIX_JSON)).toFile();
        File entriesJson = Paths.get(projectRoot, param.get("project_id").toString(), entity, param.get("entity_fileName").toString().concat(SUFFIX_ENTRIES).concat(SUFFIX_JSON)).toFile();
        boolean exists = !entityJson.exists();
        if (exists) {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
            objectMapper.writeValue(entityJson, param.get("entity"));
            objectMapper.writeValue(entriesJson, param.get("entries"));
        }
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("result", exists);
        return result;
    }

}
