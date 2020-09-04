/**
 * 
 */
package com.chatcor.biz.svc;

import java.util.List;
import java.util.Map;

import com.chatcor.biz.model.DataCommand;

/**
 * 
 * 데이터 생성, 프로젝트 생성, 데이터 업로드, 설정  및 관리 등의 기능 처리 Serive 인터페이스
 * 
 * @author Lewis
 *
 */
public interface MainService {

    public Map<String, Object> createProject(Map<String, Object> project) throws Exception;
    
    public Map<String, Object> createBertProject(Map<String, Object> project) throws Exception;

    public boolean hasProject(String name) throws Exception;

    public boolean removeProject(String name) throws Exception;

    public Map<String, List<Object>> getProjectMap() throws Exception;

    public Map<String, List<Object>> getProjectInfos() throws Exception;

    public Map<String, Object> makeProjectData(Map<String, Object> project) throws Exception;

    public List<Map<String, Object>> getPredicates(String projectName) throws Exception;
    
    public Map<String, Object> uploadDataFile(DataCommand model) throws Exception;

    public Map<String, Object> createPredicate(Map<String, Object> predicate) throws Exception;

    public Map<String, Object> removePredicate(Map<String, Object> predicate) throws Exception;

    public Map<String, Object> modifyPredicate(Map<String, Object> predicate) throws Exception;

    public boolean hasPredicate(Map<String, Object> predicate) throws Exception;

}
