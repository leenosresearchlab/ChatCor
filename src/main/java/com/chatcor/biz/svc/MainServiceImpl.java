/**
 * 
 */
package com.chatcor.biz.svc;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.chatcor.biz.model.DataCommand;
import com.chatcor.core.BaseService;
import com.chatcor.util.Compress;
import com.fasterxml.jackson.core.JsonParseException;
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

    @Value("${project.entity}")
    private String entity;

    @Value("${project.intent}")
    private String intent;

    @Value("${project.sentence}")
    private String sentence;

    private static final String JSON_PROJECT_LIST = "project-list.json";

    private static final String JSON_CONFIG = "config.json";

    private static final String KEY_PROJECT_LIST = "project_list";

    private static final String KEY_PROJECT_ID_LIST = "project_id_list";

    private static final String SUFFIX_ZIP = ".zip";

    @Override
    public Map<String, Object> createProject(Map<String, Object> project) throws Exception {
        // 1. 신규 프로젝트 생성을 위한 서버 루트 경로 프로퍼티 및 생성 폴더명 설정 : 루트경로 - repo.path
        String projectName = project.get("txtProjectName").toString();      // 프로잭트 이름
        String projectAlias = project.get("txtProjectAlias").toString();    // 프로젝트 별칭
        // 2. 프로젝트 디렉트로 및  하위 디렉토리 생성
        // TODO: 프로젝트 폴더 생서 시 예외처리 개선 필요
        File fproject= new File(projectRoot, projectName);
        FileUtils.forceMkdir(fproject);
        FileUtils.forceMkdir(new File(fproject, entity));        // Entity 디렉토리
        FileUtils.forceMkdir(new File(fproject, intent));        // Intent 디렉토리
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
        list.add(newPrjMap);
        objectMapper.writeValue(new File(fproject, JSON_CONFIG), list);
        // 프로젝트 추가
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

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, List<Object>> getProjectMap() throws Exception {
        // 전체 프로젝트 리스트에 신규 프로젝트 이름 추가 -  { projectList: [프로젝트1, 프로젝트2, ....] }
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, List<Object>> map = null;
        File prjFile = new File(projectRoot, JSON_PROJECT_LIST);
        // TODO: Project Alias List 추가여부 검토 후 구현 추가 필요
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
        String fileName = project.get("txtProjectFileName").toString().concat(SUFFIX_ZIP);
        List<String> exDirList = new ArrayList<String>();
        if (!Boolean.parseBoolean(project.get("cbxEntity").toString())) {
            exDirList.add(entity);
        }
        if (!Boolean.parseBoolean(project.get("cbxIntent").toString())) {
            exDirList.add(intent);
        }
        // Sentences 폴더 제외
        exDirList.add(sentence);
        // config.json & predicate.json 제외
        exDirList.add("config.json");
        exDirList.add("predicate.json");
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
        logger.info(resultMap.toString());
        return resultMap;
    }

    @Override
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public List<Map<String, Object>> getPredicates(String projectName) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        File file = Paths.get(projectRoot, projectName, "predicate.json").toFile();
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
    public Map<String, Object> uploadDataFile(DataCommand model) throws Exception {
        logger.debug(model.toString());
        // file.transferTo(new File(DOWNLOAD_PATH + "/" + SINGLE_FILE_UPLOAD_PATH, file.getOriginalFilename()));
        String strSubDir = null;
        if (StringUtils.equals("1", model.getRdSelInfo())) {
            // Entity
            strSubDir = entity;
        } else {
            // Sentence
            strSubDir = sentence;
        }
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        try {
            File file = Paths.get(projectRoot, model.getSelUpProjects(), strSubDir, model.getFlUpFileData().getOriginalFilename()).toFile();
            model.getFlUpFileData().transferTo(file);
            result.put("upload_status", true);
        } catch (IOException e) {
            result.put("upload_status", false);
        } catch (IllegalStateException ie) {
            result.put("upload_status", false);
        }
        return result;
    }

    @Override
    public Map<String, Object> createPredicate(Map<String, Object> predicate) throws Exception {
        String projectId = predicate.get("project_id").toString();            // 프로잭트 ID
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
        objectMapper.writeValue(Paths.get(projectRoot, projectId, "predicate.json").toFile(), predicateList);
        return map;
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, List<Object>> getProjectInfos() throws Exception {
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
        List<Object> list = map.get(KEY_PROJECT_LIST);
        logger.debug(list.toString());
        for (Object obj : list) {
            Map<String, Object> tmap = (LinkedHashMap<String, Object>) obj;
            logger.debug(tmap.toString());
            String prjId = tmap.get("project_id").toString();
            // 프로젝트 Intent 갯수
            File file = Paths.get(projectRoot, prjId, intent).toFile();
            tmap.put("intent_cnt", file.list().length);
            // 프로젝트 Entity 갯수
            file = Paths.get(projectRoot, prjId, entity).toFile();
            tmap.put("entity_cnt", file.list().length);
        }
        return map;
    }

    @Override
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public Map<String, List<Object>> getSentences(String projectName) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        File [] fileList = Paths.get(projectRoot, projectName, sentence).toFile().listFiles();
        Map sentence = new LinkedHashMap();
        List list = new ArrayList(), slist = new ArrayList();
        logger.debug("File List: {}", fileList.length);
        int idx = 0;
        for (File file : fileList) {
            Map map = null, smap = new LinkedHashMap();
            try {
                map = mapper.readValue(file, Map.class);
                logger.debug("UTF-8");
            } catch (JsonParseException je) {
                InputStreamReader is = new InputStreamReader(new FileInputStream(file), "EUC-KR");
                map = mapper.readValue(is, Map.class);
                logger.debug("EUC-KR");
            }
            list.add(map);
            smap.put("index", idx ++);
            smap.put("file_name", file.getName());
            String strSentence = ((Map) ((List) map.get("sentences")).get(0)).get("sentence").toString();
            logger.debug(strSentence);
            smap.put("sentence", StringUtils.remove(strSentence, "<Sentance/>").trim());
            slist.add(smap);
        }
        sentence.put("sentences", slist);
        sentence.put("sentence_list", list);
        return sentence;
    }

}
