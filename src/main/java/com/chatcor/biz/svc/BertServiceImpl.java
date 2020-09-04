package com.chatcor.biz.svc;

import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.chatcor.core.BaseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonParser.Feature;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.List;

@Service("bertService")
public class BertServiceImpl extends BaseService implements BertService {

	@Override
	public Map<String, Object> getBertProject(Map<String, Object> map) throws Exception {
		logger.debug("{}", map);
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        ArrayList<Float> versionList = new ArrayList<>();
        ArrayList<String> fileList = new ArrayList<>();
        ArrayList<String> backupfileList = new ArrayList<>();
        
        String txtlastVersion;
        float lastVersion;
        
        //File file = Paths.get(projectRoot).toFile();
        File versionInfo = new File(projectRoot + map.get("project_id") + "/" + map.get("BertFile_Type"));
        File[] versionName = versionInfo.listFiles();
        try {
        	for(int i=0; i < versionName.length; i++) {
        		String txtversion = versionName[i].toString();
        		versionList.add(Float.parseFloat(txtversion.substring(txtversion.lastIndexOf("\\")+2)));
        	}
        }catch(Exception e) {
        	e.printStackTrace();
        }
        lastVersion = versionList.get(0);
        for(int i = 1; i < versionList.size(); i++) {
        	if(versionList.get(i) >= lastVersion) {
        		lastVersion = versionList.get(i);
        	}
        }
        txtlastVersion = "v" + String.valueOf(lastVersion);
        File fileInfo = new File(projectRoot + map.get("project_id") + "/" + map.get("BertFile_Type")+ "/" + txtlastVersion);
        File backupfileInfo = new File(projectRoot + map.get("project_id") + "/" + map.get("BertFile_Type")+ "/" + txtlastVersion + "/" + "BackUp");
        
        File[] fileName = fileInfo.listFiles();
        File[] backupfileName = backupfileInfo.listFiles();
        
        try {
        	for(int i=0; i < fileName.length; i++) {
        		if(fileName[i].isFile()) {
        			fileList.add(fileName[i].toString().substring(fileName[i].toString().lastIndexOf("\\")+1));
        		}
        	}
        }catch(Exception e) {
        	e.printStackTrace();
        }
        try {
        	if(backupfileInfo.exists()) {
        		for(int i=0; i < backupfileName.length; i++) {
        			backupfileList.add(backupfileName[i].toString().substring(backupfileName[i].toString().lastIndexOf("\\")+1));
            	}
        	}
        	else {
        		backupfileList.add("false");
        	}
        	
        }catch(Exception e){
        	e.printStackTrace();
        }
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("version", txtlastVersion);
        result.put("fileList", fileList);
        result.put("backupfileList", backupfileList);
                
        return result;
	}

	@Override
	public Map<String, Object> getBertFile(Map<String, Object> map) throws Exception {
		logger.debug("{}", map);
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        
        String strBackUp = "/BackUp";
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        
        //File backupinfo = new File(projectRoot + map.get("project_id") + "/" + map.get("BertFile_Type") + "/" + map.get("BertFile_version") + strBackUp);
        File fileInfo = new File(projectRoot + map.get("project_id") + "/" + map.get("BertFile_Type") + "/" + map.get("BertFile_version") + "/" + map.get("BertFile_name"));
                                
        if(map.get("BertFile_Backup").toString().equals("BackUp")) {
        	String filename = map.get("BertFile_name").toString();
         	
        	File backUpInfo = new File(projectRoot + map.get("project_id") + "/" + map.get("BertFile_Type") + "/" + map.get("BertFile_version") + strBackUp +"/" + filename);
        	BufferedReader br = new BufferedReader(new FileReader(backUpInfo));
        	
        	StringBuffer stringBuffer = new StringBuffer();
            String temptext = null;
            while ((temptext = br.readLine())!=null) {
            	stringBuffer.append(temptext);
            	stringBuffer.append(System.getProperty("line.separator"));
            } 
            
            
            result.put("bertFile", stringBuffer);
        }
        else {
        	BufferedReader br = new BufferedReader(new FileReader(fileInfo));
        	
        	StringBuffer stringBuffer = new StringBuffer();
            String temptext = null;
            while ((temptext = br.readLine())!=null) {
            	stringBuffer.append(temptext);
            	stringBuffer.append(System.getProperty("line.separator"));
            } 
            
            
            result.put("bertFile", stringBuffer);
        }
        
        
		return result;
	}

	@Override
	public Map<String, Object> saveBertFile(Map<String, Object> map) throws Exception {
		logger.debug("{}", map);
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        
        String strBackUp = "/BackUp";
        String originfile = "test" + map.get("BertFile_Type") + ".txt";
        File fileinfo = new File(projectRoot + map.get("project_id") + "/" + map.get("BertFile_Type") + "/" + map.get("BertFile_version"));
        File backupinfo = new File(projectRoot + map.get("project_id") + "/" + map.get("BertFile_Type") + "/" + map.get("BertFile_version") + strBackUp);
        if(!backupinfo.isDirectory()) {
        	FileUtils.forceMkdir(backupinfo);
        }
        
        SimpleDateFormat format1 = new SimpleDateFormat ( "yyyyMMddHHmmss");
        Calendar time = Calendar.getInstance();
        String format_time1 = format1.format(time.getTime());
        
        try {
        	BufferedWriter fw1 = new BufferedWriter(new FileWriter(fileinfo + "/" + originfile, false));
        	fw1.write(map.get("BertFile_content").toString());
        	fw1.flush();
        	fw1.close();
        
        	BufferedWriter fw2 = new BufferedWriter(new FileWriter(backupinfo + "/" + format_time1 + ".txt", false));
        	fw2.write(map.get("BertFile_content").toString());
        	fw2.flush();
        	fw2.close();
        	
        	result.put("result", "success");
        }catch (Exception e) {
			e.printStackTrace();
			result.put("result", "fale");
		}
        
        

		return result;
	}

	@Override
	public Map<String, Object> changeVersion(Map<String, Object> map) throws Exception {
		logger.debug("{}", map);
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        
        Map<String, Object> result = new LinkedHashMap<String, Object>();
        String originfile = "test" + map.get("BertFile_Type") + ".txt";
        float versionNum = Float.parseFloat(map.get("BertFile_version").toString());
        versionNum = (float)(versionNum + 0.1);
        String chVersion = "v" + String.valueOf(versionNum);
        File fileinfo = new File(projectRoot + map.get("project_id") + "/" + map.get("BertFile_Type") + "/" + chVersion);
        
        FileUtils.forceMkdir(fileinfo);
        
        try {
        	BufferedWriter fw1 = new BufferedWriter(new FileWriter(fileinfo + "/" + originfile, false));
        	fw1.write(map.get("BertFile_content").toString());
        	fw1.flush();
        	fw1.close();
            result.put("result", "success");
        }catch (Exception e) {
			e.printStackTrace();
			result.put("result", "fale");
		}
        return result;
	}
	

}
