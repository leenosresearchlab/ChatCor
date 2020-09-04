/**
 * 
 */
package com.chatcor.biz.svc;

import java.util.List;
import java.util.Map;

/**
 * 
 * 문장 분석 / 정제 / 내용어 추출  기능 처리 Serive 인터페이스 (Sentence)
 * 
 * @author Lewis
 *
 */
public interface SentenceService {

    public  Map<String, List<Object>> getSentences(String projectName) throws Exception;

    public Map<String, Object> modifySentence(Map<String, Object> objSentence) throws Exception;

    public Map<String, Object> exportSentence(Map<String, Object> map) throws Exception;

}
