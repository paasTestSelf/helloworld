package com.xiaoha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;


@SpringBootApplication
public class BootApplication extends SpringBootServletInitializer {

    /* 这个方法在打包在war包运行时是必需的 */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BootApplication.class);
    }
    public static void main(String[] args) {
        SpringApplication.run(BootApplication.class, args);
    }



}
