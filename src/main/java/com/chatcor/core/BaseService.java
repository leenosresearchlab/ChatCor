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

}
