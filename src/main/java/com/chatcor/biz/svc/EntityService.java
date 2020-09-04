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
public interface EntityService {

    public Map<String, Object> listEntries(String prjName) throws Exception;

    public Map<String, Object> getEntries(Map<String, Object> param) throws Exception;

    public Map<String, Object> getEntities(Map<String, Object> param) throws Exception;

    public Map<String, Object> addEntities(Map<String, Object> param) throws Exception;

    public Map<String, Object> delEntityEntries(Map<String, Object> param) throws Exception;

    public Map<String, Object> addEntry(Map<String, Object> param) throws Exception;

    public Map<String, Object> createEntity(Map<String, Object> param) throws Exception;

}
