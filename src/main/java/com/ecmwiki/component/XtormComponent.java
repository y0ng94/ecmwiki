package com.ecmwiki.component;

import com.windfire.apis.asys.asysUsrElement;
import com.windfire.apis.asysConnectData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class XtormComponent {

    @Value("${xtorm.engine.ip}")
    String engineIp;
    @Value("${xtorm.engine.port}")
    int enginePort;
    @Value("${xtorm.engine.description}")
    String description;
    @Value("${xtorm.engine.id}")
    String engineId;
    @Value("${xtorm.engine.pw}")
    String enginePw;
    @Value("${xtorm.engine.cClassId}")
    String cClassId;
    @Value("${xtorm.engine.eClassId}")
    String eClassId;
    @Value("${xtorm.engine.userSClass}")
    String userSClass;
    @Value("${xtorm.engine.gateway}")
    String gateway;

    private asysConnectData connect() {
        return new asysConnectData(engineIp, enginePort, description, engineId, enginePw);
    }

    private void disconnect(asysConnectData con) {
        if (con != null) {
            con.close();
            con = null;
        }
    }

    public Map<String, Object> create(String filePath) {
        Map<String, Object> result = new HashMap<String, Object>();

        asysConnectData con = connect();

        try {
            asysUsrElement usrElement = new asysUsrElement(con);

            usrElement.m_localFile = filePath;
            usrElement.m_descr = description;
            usrElement.m_cClassId = cClassId;
            usrElement.m_eClassId = eClassId;
            usrElement.m_userSClass = userSClass;

            int ret = usrElement.create(gateway);

            result.put("ret", ret);

            if (ret == 0) {
                log.info("Success, create normal, " + usrElement.m_elementId);
                result.put("elementId", usrElement.getShortID());
                result.put("url", "/file/download/" + usrElement.getShortID());
            } else {
                log.error("Error, create normal, " + usrElement.getLastError());
                result.put("error", usrElement.getLastError());
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            result.put("error", e.getMessage());
        } finally {
            disconnect(con);
        }

        return result;
    }

    public Map<String, Object> download(String filePath, String elementId) {
        Map<String, Object> result = new HashMap<String, Object>();

        asysConnectData con = connect();

        try {
            asysUsrElement usrElement = new asysUsrElement(con);

            usrElement.m_elementId = gateway + "::" + elementId + "::" + eClassId;

            String downloadFile = filePath + File.separator + elementId;

            int ret = usrElement.getContent(downloadFile);

            result.put("ret", ret);

            if (ret == 0) {
                log.info("Success, download normal, " + usrElement.m_elementId);
                result.put("file", downloadFile);
            } else {
                log.error("Error, download normal, " + usrElement.getLastError());
                result.put("error", usrElement.getLastError());
            }

        } catch (Exception e) {
            log.error(e.getMessage());
            result.put("error", e.getMessage());
        } finally {
            disconnect(con);
        }

        return result;
    }

    public Map<String, Object> delete(String elementId) {
        Map<String, Object> result = new HashMap<String, Object>();

        asysConnectData con = connect();

        try {
            asysUsrElement usrElement = new asysUsrElement(con);

            usrElement.m_elementId = gateway + "::" + elementId + "::" + eClassId;

            int ret = usrElement.delete();

            result.put("ret", ret);

            if (ret == 0) {
                log.info("Success, delete is done, " + usrElement.m_elementId);
                result.put("elementId", usrElement.getShortID());
            } else {
                log.error("Error, failed to delete, " + usrElement.getLastError());
                result.put("error", usrElement.getLastError());
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            result.put("error", e.getMessage());
        } finally {
            disconnect(con);
        }

        return result;
    }
}
