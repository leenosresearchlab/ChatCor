package com.chatcor.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * @author Lewis
 *
 */

@Service
public abstract class BaseService {

    // ChatCor Base Logger
    protected final Logger logger = LoggerFactory.getLogger(getClass());

    // ChatCor 프로젝트 루트 경로
    @Value("${project.root}")
    protected String projectRoot;

    @Value("${project.entity}")
    protected String entity;

    @Value("${project.entry}")
    protected String entry;

    @Value("${project.intent}")
    protected String intent;

    @Value("${project.intent.work}")
    protected String intentWork;

    @Value("${project.sentence}")
    protected String sentence;

    @Value("${project.day}")
    protected String day;
    
    @Value("${project.month}")
    protected String month;
    
    @Value("${project.quater}")
    protected String quater;
    
    @Value("${project.year}")
    protected String year;
    
    @Value("${project.bert}")
    protected String bert;
    
 
    @Value("${chatcor.text.encoding}")
    protected String txtEncoding;

    @Value("${chatcor.text.file.suffix}")
    protected String txtSuffix;

    protected static final String SUFFIX_ZIP = ".zip";

    protected static final String SUFFIX_JSON = ".json";

    protected static final String SUFFIX_ENTRIES = "_entries_ko";

    protected static final String SUFFIX_INTENTS = "_usersays_ko";
}
