package com.chatcor.biz.model;

import org.springframework.web.multipart.MultipartFile;

public class DataCommand {

    private MultipartFile flUpFileData;

    private String selUpProjects;

    private String rdSelInfo;

    public MultipartFile getFlUpFileData() {
        return flUpFileData;
    }

    public void setFlUpFileData(MultipartFile flUpFileData) {
        this.flUpFileData = flUpFileData;
    }

    public String getSelUpProjects() {
        return selUpProjects;
    }

    public void setSelUpProjects(String selUpProjects) {
        this.selUpProjects = selUpProjects;
    }

    public String getRdSelInfo() {
        return rdSelInfo;
    }

    public void setRdSelInfo(String rdSelInfo) {
        this.rdSelInfo = rdSelInfo;
    }

    @Override
    public String toString() {
        return "DataCommand [flUpFileData=" + flUpFileData + ", selUpProjects=" + selUpProjects + ", rdSelInfo="
                + rdSelInfo + "]";
    }

}
