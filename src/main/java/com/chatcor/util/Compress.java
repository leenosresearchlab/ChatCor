package com.chatcor.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Stack;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 파일 압축 유틸리티 클래스
 * 
 * 
 * @author Lewis
 *
 */
public final class Compress {

    // Logger
    final Logger logger = LoggerFactory.getLogger(getClass());

    /**
     * @param rootPath
     * @param fileName
     * @param exDirList
     * @throws IOException
     */
    public void compress(String rootPath, String fileName, List<String> exDirList) throws IOException {
        File fileRoot = new File(rootPath);
        File zippedFile = new File(rootPath, fileName);
        if (!zippedFile.exists()) {
            zippedFile.createNewFile();
        }
        ZipArchiveOutputStream zos = new ZipArchiveOutputStream(new FileOutputStream(zippedFile));
        zos.setEncoding("UTF-8");
        FileInputStream fis = null;
        int length = 0;
        ZipArchiveEntry ze = null;
        byte[] buf = new byte[8 * 1024];
        String name = null;
        Stack<File> stack = new Stack<File>();
        stack.push(fileRoot);
        while (!stack.isEmpty()) {
            File f = stack.pop();
            // 현재 압축파일 제외
            if (f.getName().endsWith(".zip")) {
                continue;
            }
            name = toPath(fileRoot, f);
            logger.info(f.getName());
            // 압축제외 폴더 제거
            if (exDirList.contains(f.getName())) {
                continue;
            }
            if (f.isDirectory()) {
                File[] fs = f.listFiles();
                // 빈 디렉토리 포함
                if (fs.length == 0) {
                    zos.putArchiveEntry(new ZipArchiveEntry(name));
                }
                for (int i = 0; i < fs.length; i++) {
                    if (fs[i].isDirectory()) {
                        stack.push(fs[i]);
                    } else {
                        stack.add(0, fs[i]);
                    }
                }
            } else {
                ze = new ZipArchiveEntry(name);
                zos.putArchiveEntry(ze);
                fis = new FileInputStream(f);
                while ((length = fis.read(buf, 0, buf.length)) >= 0) {
                    zos.write(buf, 0, length);
                }
                fis.close();
                zos.closeArchiveEntry();
            }
        }
        zos.close();
    }

    /**
     * @param root
     * @param dir
     * @return
     */
    private String toPath(File root, File dir) {
        String path = dir.getAbsolutePath();
        path = path.substring(root.getAbsolutePath().length()).replace(File.separatorChar, '/');
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        if (dir.isDirectory() && !path.endsWith("/")) {
            path += "/";
        }
        return path;
    }

}
