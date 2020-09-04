/**
 * 
 */
package com.chatcor.biz.svc;

import java.util.Map;

/**
 * 
 * 엔트리 / 엔티티 편집 기능 처리 Serive 인터페이스 (Entry & Entity)
 * 
 * @author Lewis
 *
 */
public interface BertService {
	
    public Map<String, Object> getBertProject(Map<String, Object> map) throws Exception;

    public Map<String, Object> getBertFile(Map<String, Object> map) throws Exception;

    public Map<String, Object> saveBertFile(Map<String, Object> map) throws Exception;
    
    public Map<String, Object> changeVersion(Map<String, Object> map) throws Exception;
}
