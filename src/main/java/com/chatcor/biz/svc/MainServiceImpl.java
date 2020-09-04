/**
 * 
 */
package com.chatcor.biz.svc;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.io.filefilter.TrueFileFilter;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.chatcor.biz.model.DataCommand;
import com.chatcor.core.BaseService;
import com.chatcor.util.Compress;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * (파일 시스템 기반) 데이터 생성, 프로젝트 생성, 데이터 업로드, 설정  및 관리 등의 기능 처리 Serive 클래스
 * 
 * @author Lewis
 *
 */
@Service("mainService")
public class MainServiceImpl extends BaseService implements MainService {

    private static final String JSON_PROJECT_LIST = "project-list.json";

    private static final String JSON_CONFIG = "config.json";

    private static final String JSON_PREDICATE = "predicate.json";

    private static final String KEY_PROJECT_LIST = "project_list";

    private static final String KEY_PROJECT_ID_LIST = "project_id_list";

    @Override
    public Map<String, Object> createProject(Map<String, Object> project) throws Exception {
        // 1. 신규 프로젝트 생성을 위한 서버 루트 경로 프로퍼티 및 생성 폴더명 설정 : 루트경로 - repo.path
        String projectName = project.get("txtProjectName").toString();      // 프로젝트 이름
        String projectAlias = project.get("txtProjectAlias").toString();    // 프로젝트 별칭
        // 2. 프로젝트 디렉트로 및  하위 디렉토리 생성
        File fproject= new File(projectRoot, projectName);
        FileUtils.forceMkdir(fproject);
        FileUtils.forceMkdir(new File(fproject, entity));        // Entity 디렉토리
        FileUtils.forceMkdir(new File(fproject, entry));         // Entry 디렉토리
        FileUtils.forceMkdir(new File(fproject, intent));        // Intent 디렉토리
        FileUtils.forceMkdir(new File(fproject, intentWork));    // Intent 디렉토리
        FileUtils.forceMkdir(new File(fproject, sentence));      // Sentence 디렉토리
        // 3. 생성된 프로젝트  JSON Map 생성 및 프로젝트 루트에 파일 저장 : 이름, 별칭, 버전, 상태(true/false)
        Map<String, Object> newPrjMap = new LinkedHashMap<String, Object>();
        newPrjMap.put("project_id", projectName); 
        if (StringUtils.isAllEmpty(projectAlias)) {
            newPrjMap.put("project_name", projectName);
        } else {
            newPrjMap.put("project_name", projectAlias);
        }
        // 프로젝트  JSON 파일 저장 : package.json
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        List<Object> list = new ArrayList<Object>();
        // predicate.json 파일 생성
        objectMapper.writeValue(new File(fproject, JSON_PREDICATE), list);
        list.add(newPrjMap);
        // config.json 파일 생성
        objectMapper.writeValue(new File(fproject, JSON_CONFIG), list);
        // 프로젝트 추가
        Map<String, List<Object>> map = getProjectMap();
        map.get(KEY_PROJECT_ID_LIST).add(projectName);
        map.get(KEY_PROJECT_LIST).add(newPrjMap);
        objectMapper.writeValue(new File(projectRoot, JSON_PROJECT_LIST), map);
        return newPrjMap;
    }
    
    
    @Override
    public Map<String, Object> createBertProject(Map<String, Object> project) throws Exception {
        // 1. 신규 Bert학습용 프로젝트 생성을 위한 서버 루트 경로 프로퍼티 및 생성 폴더명 설정 : 루트경로 - repo.path
        String projectName = project.get("txtBertProjectName").toString() + bert;      // 프로젝트 이름
        String projectAlias = project.get("txtBertProjectAlias").toString() + bert;    // 프로젝트 별칭
        
        String projectVersion = "/v0.1";
        // 2. 프로젝트 디렉트로 및  하위 디렉토리 생성
        File fproject= new File(projectRoot, projectName);
        FileUtils.forceMkdir(fproject);
        FileUtils.forceMkdir(new File(fproject, day+projectVersion));        // 일별 디렉토리
        FileUtils.forceMkdir(new File(fproject, month+projectVersion));         // 월별 디렉토리
        FileUtils.forceMkdir(new File(fproject, quater+projectVersion));        // 분기별 디렉토리
        FileUtils.forceMkdir(new File(fproject, year+projectVersion));    // 연차별 디렉토리
        // 3. 생성된 프로젝트 내부에  Text 생성 및 프로젝트 루트에 파일 저장 : 이름, 별칭, 버전, 상태(true/false)
        Map<String, Object> newPrjMap = new LinkedHashMap<String, Object>();
        newPrjMap.put("project_id", projectName); 
        if (StringUtils.isAllEmpty(projectAlias)) {
            newPrjMap.put("project_name", projectName);
        } else {
            newPrjMap.put("project_name", projectAlias);
        }
        // 프로젝트  TXET 파일 저장 : (projectname_(day, month, quater, year)_time.txt)
        String text = "여기에 작성해 주시면 됩니다.";
        String fileNameDay = fproject + "/" + day + projectVersion + "/" + "testDay.txt";
        String fileNameMonth = fproject + "/" + month + projectVersion + "/" + "testMonth.txt";
        String fileNameQuater = fproject + "/" + quater + projectVersion + "/" + "testQuater.txt";
        String fileNameYear = fproject + "/" + year + projectVersion + "/" + "testYear.txt";
        
        ArrayList<String> fileList = new ArrayList<>();
        fileList.add(fileNameDay);
        fileList.add(fileNameMonth);
        fileList.add(fileNameQuater);
        fileList.add(fileNameYear);
        
        for(int i = 0; i < fileList.size(); i++) {
        	try {
            	BufferedWriter fw = new BufferedWriter(new FileWriter(fileList.get(i), true));
            	fw.write(text);
            	fw.flush();
            	fw.close();
            }catch (Exception e) {
    			e.printStackTrace();
    		}
        }
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, List<Object>> map = getProjectMap();
        map.get(KEY_PROJECT_ID_LIST).add(projectName);
        map.get(KEY_PROJECT_LIST).add(newPrjMap);
        objectMapper.writeValue(new File(projectRoot, JSON_PROJECT_LIST), map);
        return newPrjMap;
    }

    @Override
    public boolean hasProject(String name) throws Exception {
        Map<String, List<Object>> map = getProjectMap();
        return map.get(KEY_PROJECT_ID_LIST).contains(name);
    }

    @SuppressWarnings("rawtypes")
    @Override
    public boolean removeProject(String name) throws Exception {
    	boolean result = false;
        Map<String, List<Object>> mapProject = getProjectMap();
        List listPrjId = mapProject.get("project_id_list");
        int idx = listPrjId.indexOf(name);
        if (listPrjId.remove(name)) {
            mapProject.get("project_list").remove(idx);
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
            objectMapper.writeValue(new File(projectRoot, JSON_PROJECT_LIST), mapProject);
            try {
                FileUtils.deleteDirectory(Paths.get(projectRoot, name).toFile());
                result = true;
            } catch (IOException ie) {
                result = false;
            }
        }
        return result;
    }

    @SuppressWarnings("unchecked")
    @Override
    public Map<String, List<Object>> getProjectMap() throws Exception {
        // 전체 프로젝트 리스트에 신규 프로젝트 이름 추가 -  { projectList: [프로젝트1, 프로젝트2, ....] }
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, List<Object>> map = null;
        File prjFile = new File(projectRoot, JSON_PROJECT_LIST);
        if (prjFile.exists()) {
            map = objectMapper.readValue(prjFile, LinkedHashMap.class);
        } else {
            map = new LinkedHashMap<String, List<Object>>();
            List<Object> prjList = new ArrayList<Object>();
            map.put(KEY_PROJECT_ID_LIST, prjList);
            prjList = new ArrayList<Object>();
            map.put(KEY_PROJECT_LIST, prjList);
        }
        return map;
    }

    @Override
    public Map<String, Object> makeProjectData(Map<String, Object> project) throws Exception {
        String fileRoot = projectRoot.concat(project.get("selMkProjects").toString());
        String fileName = project.get("txtProjectFileName").toString();
        if (StringUtils.isBlank(fileName)) {
            fileName = project.get("selMkProjects").toString();
        }
        fileName = fileName.concat(SUFFIX_ZIP);
        List<String> exDirList = new ArrayList<String>();
        if (!Boolean.parseBoolean(project.get("cbxEntity").toString())) {
            exDirList.add(entity);
        }
        if (!Boolean.parseBoolean(project.get("cbxIntent").toString())) {
            exDirList.add(intent);
            // intent_work 폴더 제외
            exDirList.add(intentWork);
        }
        // Sentences 폴더 제외
        exDirList.add(sentence);
        // Entries 폴더 제외
        exDirList.add(entry);
        // config.json & predicate.json 제외
        exDirList.add("config.json");
        exDirList.add(JSON_PREDICATE);
        logger.debug(exDirList.toString());
        // Result
        Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
        resultMap.put("project_id", project.get("txtProjectFileName"));
        resultMap.put("file_path", Paths.get(fileRoot, fileName));
        try {
            Compress comp = new Compress();
            comp.compress(fileRoot, fileName, exDirList);
            resultMap.put("status", true);
        } catch (IOException ie) {
            resultMap.put("status", false);
        }
        logger.debug(resultMap.toString());
        return resultMap;
    }

    @Override
    public Map<String, Object> uploadDataFile(DataCommand model) throws Exception {
        logger.debug(model.toString());
        String strSubDir = null;
        if (StringUtils.equals("1", model.getRdSelInfo())) {
            // Entity
            strSubDir = entity;
        } else {
            // Sentence
            strSubDir = sentence;
        }
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        File file = Paths.get(projectRoot, model.getSelUpProjects(), strSubDir, model.getFlUpFileData().getOriginalFilename()).toFile();
        try {
            if (!file.exists()) {
                model.getFlUpFileData().transferTo(file);
                ObjectMapper mapper = new ObjectMapper();
                mapper.readValue(file, Object.class);
                result.put("upload_status", true);
            } else {
                result.put("upload_status", false);
            }
        } catch (JsonParseException je) {
            // XXX: Encodig 문제로 예외가 발생하는 경우 존재 : UTF-8인 경우에만 정상 처리 가능.
            logger.error("{}", je.getMessage());
            if (file.exists()) {
                FileUtils.forceDelete(file);
            }
            result.put("upload_status", false);
        } catch (IOException e) {
            result.put("upload_status", false);
        } catch (IllegalStateException ie) {
            result.put("upload_status", false);
        }
        return result;
    }

    @Override
    public Map<String, Object> createPredicate(Map<String, Object> predicate) throws Exception {
        String projectId = predicate.get("project_id").toString();            // 프로젝트 ID
        String predicateName = predicate.get("predicate_name").toString();    // 반복관용어구 태그명
        List<Map<String, Object>> predicateList = getPredicates(projectId);
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        map.put("predicate_name", predicateName);
        map.put("phrases", new ArrayList<String>());
        predicateList.add(map);
        logger.debug(predicateList.toString());
        // Predicate JSON 파일 재생성
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        objectMapper.writeValue(Paths.get(projectRoot, projectId, JSON_PREDICATE).toFile(), predicateList);
        return map;
    }

    @SuppressWarnings("unchecked")
    @Override
    public Map<String, List<Object>> getProjectInfos() throws Exception {
        // 전체 프로젝트 리스트에 신규 프로젝트 이름 추가 -  { projectList: [프로젝트1, 프로젝트2, ....] }
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        Map<String, List<Object>> map = null;
        File prjFile = new File(projectRoot, JSON_PROJECT_LIST);
        if (prjFile.exists()) {
            map = objectMapper.readValue(prjFile, LinkedHashMap.class);
        } else {
            map = new LinkedHashMap<String, List<Object>>();
            List<Object> prjList = new ArrayList<Object>();
            map.put(KEY_PROJECT_ID_LIST, prjList);
            prjList = new ArrayList<Object>();
            map.put(KEY_PROJECT_LIST, prjList);
        }
        List<Object> list = map.get(KEY_PROJECT_LIST);
        logger.debug(list.toString());
        for (Object obj : list) {
            Map<String, Object> tmap = (LinkedHashMap<String, Object>) obj;
            logger.debug(tmap.toString());
            String prjId = tmap.get("project_id").toString();
            if(!prjId.contains(bert)) {
                // 프로젝트 Intent 갯수
                IOFileFilter filter = new WildcardFileFilter("*".concat(SUFFIX_INTENTS).concat("*"));
                Iterator<File> iter = FileUtils.iterateFiles(Paths.get(projectRoot, prjId, intentWork).toFile(), filter, TrueFileFilter.INSTANCE);
                int count = 0;
                while(iter.hasNext()) {
                    File file = iter.next();
                    logger.debug("{}", file.getName());
                    count += objectMapper.readValue(file, List.class).size();
                }
                tmap.put("intent_cnt", count);
                // 프로젝트 Entity 갯수
                filter = new WildcardFileFilter("*".concat(SUFFIX_ENTRIES).concat("*"));
                iter = FileUtils.iterateFiles(Paths.get(projectRoot, prjId, entity).toFile(), filter, TrueFileFilter.INSTANCE);
                count = 0;
                while(iter.hasNext()) {
                    File file = iter.next();
                    logger.debug("{}", file.getName());
                    count += objectMapper.readValue(file, List.class).size();
                }
                tmap.put("entity_cnt", count);
            }
            else {
            	tmap.put("intent_cnt", 0);
            	tmap.put("entity_cnt", 0);
            }
        }
        return map;
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    @Override
    public List<Map<String, Object>> getPredicates(String projectName) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        File file = Paths.get(projectRoot, projectName, JSON_PREDICATE).toFile();
        List list = null;
        try {
            list = mapper.readValue(file, List.class);
            logger.debug("UTF-8");
        } catch (JsonMappingException je) {
            InputStreamReader is = new InputStreamReader(new FileInputStream(file), "EUC-KR");
            list = mapper.readValue(is, List.class);
            logger.debug("EUC-KR");
        }
        logger.debug(list.toString());
        return list;
    }

    @Override
    public Map<String, Object> removePredicate(Map<String, Object> predicate) throws Exception {
        String projectId = predicate.get("project_id").toString();            // 프로잭트 ID
        String predicateName = predicate.get("predicate_name").toString();    // 반복관용어구 태그명
        List<Map<String, Object>> predicateList = getPredicates(projectId);
        logger.debug("Before {}", predicateList);
        for (Map<String, Object> map : predicateList) {
            if (StringUtils.equals(predicateName, map.get("predicate_name").toString())) {
                predicateList.remove(map);
                map = null;
                break;
            }
        }
        logger.debug("After {}", predicateList);
        // Predicate JSON 파일 재생성
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        objectMapper.writeValue(Paths.get(projectRoot, projectId, JSON_PREDICATE).toFile(), predicateList);
        // Result
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("status", true);
        result.put("predicate_count", predicateList.size());
        return result;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Map<String, Object> modifyPredicate(Map<String, Object> predicate) throws Exception {
        String projectId = predicate.get("project_id").toString();            // 프로잭트 ID
        String predicateName = predicate.get("predicate_name").toString();    // 반복관용어구 태그명
        List phrases = (ArrayList) predicate.get("phrases");
        List<Map<String, Object>> predicateList = getPredicates(projectId);
        logger.debug("predicateList {}", predicateList);
        for (Map<String, Object> map : predicateList) {
            if (StringUtils.equals(predicateName, map.get("predicate_name").toString())) {
                logger.debug("phrases {}", phrases);
                map.replace("phrases", phrases);
                break;
            }
        }
        // Predicate JSON 파일 재생성
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        objectMapper.writeValue(Paths.get(projectRoot, projectId, JSON_PREDICATE).toFile(), predicateList);
        // Result
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("status", true);
        result.put("predicate_count", phrases.size());
        return result;
    }

    @Override
    public boolean hasPredicate(Map<String, Object> predicate) throws Exception {
        String projectId = predicate.get("project_id").toString();            // 프로잭트 ID
        String predicateName = predicate.get("predicate_name").toString();    // 반복관용어구 태그명
        List<Map<String, Object>> predicateList = getPredicates(projectId);
        boolean result = false;
        for (Map<String, Object> map : predicateList) {
            if (StringUtils.equals(predicateName, map.get("predicate_name").toString())) {
                result = true;
                break;
            }
        }
        return result;
    }

}
