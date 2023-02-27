package com.ecmwiki.util;

import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@UtilityClass
@Slf4j
public class BCryptPasswordGeneratorUtil {

    public static void main(String[] args) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        String password = "admin12!";

        String dbPassword = "$2a$10$rb5bBf/hjVxtAtUdBCwReu4WVyUY9SNuCjQV67dUhH1PmqN05dTcG";

        String encrypted = passwordEncoder.encode(password);

        log.info("[input_password] : " + password);
        log.info("[encrypted_password] : " + encrypted);
        log.info("[db_password] : " + dbPassword);

        log.info("[input_password] and [encrypted_password matched] : " + passwordEncoder.matches(password, encrypted));
        log.info("[input_password] and [db_password patched] : " + passwordEncoder.matches(password, dbPassword));
    }
}