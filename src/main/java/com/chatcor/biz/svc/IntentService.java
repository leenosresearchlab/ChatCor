/**
 * 
 */
package com.chatcor.biz.svc;

import java.util.List;
import java.util.Map;

/**
 * 
 * Intent 학습문장 편집 기능 처리 Serive 인터페이스 (Intent)
 * 
 * @author Lewis
 *
 */
public interface IntentService {

    public Map<String, Object> listIntents(String prjName) throws Exception;

    public boolean hasIntent(Map<String, Object> map) throws Exception;

    public Map<String, Object> createIntent(Map<String, Object> map) throws Exception;

    public List<Map<String, Object>> validIntent(Map<String, Object> map) throws Exception;

    public Map<String, Object> getIntents(Map<String, Object> map) throws Exception;

    public Map<String, Object> addIntent(Map<String, Object> map) throws Exception;

    public Map<String, Object> rebuildIntents(Map<String, Object> map) throws Exception;
     
}
