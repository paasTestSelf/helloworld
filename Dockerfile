FROM registry.docker:5000/admin/tomcat:2018
RUN rm -rf /usr/local/tomcat/webapps/*
ADD ROOT.war /usr/local/tomcat/webapps/