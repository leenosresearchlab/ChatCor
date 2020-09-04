package com.chatcor.biz.svc;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.chatcor.core.BaseService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * (파일 시스템 기반) 문장 분석 / 정제 / 내용어 추출  기능 처리 Serive 클래스
 * 
 * @author Lewis
 *
 */
@Service("sentenceService")
public class SentenceServiceImpl extends BaseService implements SentenceService {

    @SuppressWarnings({ "rawtypes", "unchecked" })
    @Override
    public Map<String, List<Object>> getSentences(String projectName) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        File [] fileList = Paths.get(projectRoot, projectName, sentence).toFile().listFiles();
        Map sentence = new LinkedHashMap();
        List list = new ArrayList(), slist = new ArrayList();
        logger.debug("File List: {}", fileList.length);
        int idx = 0;
        for (File file : fileList) {
            Map map = null, smap = new LinkedHashMap();
            try {
                map = mapper.readValue(file, Map.class);logger.debug("UTF-8");
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

    @Override
    public Map<String, Object> modifySentence(Map<String, Object> objSentence) throws Exception {
        logger.debug("{}", sentence);
        // Predicate JSON 파일 재생성
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        objectMapper.writeValue(Paths.get(projectRoot, objSentence.get("project_name").toString(), sentence, objSentence.get("file_name").toString()).toFile(), objSentence.get("sentence"));
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("result", true);
        return result;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Map<String, Object> exportSentence(Map<String, Object> map) throws Exception {
        logger.debug("{}", map);
        String contentFile = StringUtils.join(map.get("content_file"), txtSuffix);
        FileUtils.writeLines(Paths.get(projectRoot, map.get("project_id").toString(), entry, contentFile).toFile(), txtEncoding, (List) map.get("content_list"));
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("file_name", contentFile);
        result.put("result", true);
        return result;
    }

}
