FROM ubuntu:latest

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -y update && \
    dpkg -l | grep ^ii | cut -d' ' -f3 | grep -v '^libgcc-s1:amd64$' | xargs apt-get install -y --reinstall && \
    rm -r /var/lib/apt/lists/* 

# Install Required Tools
RUN rm /var/lib/apt/lists/* -vfR && \
    apt-get update && \
    apt-get install -y vim wget curl tar git bash-completion software-properties-common \
                        apt-file apt-utils bc cmake man nano rpm telnet tree traceroute \
                        sudo net-tools

# Install GCC, GDB, Python3
RUN apt-get update && \
    apt-get install -y gcc gdb python3 python3-pip libpython3-dev

# Install Java (OpenJDK 8) and OpenSSH 
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk openssh-server openssh-client

# Updating all tools and OS
RUN rm /var/lib/apt/lists/* -vfR && \
    apt-get update && \
    apt-get upgrade -y &&\
    apt-get dist-upgrade -y
RUN rm -rf /tmp/*
RUN yes | unminimize
RUN echo "Set disable_coredump false" >> /etc/sudo.conf

# Setting up Non-root user and OpenSSH for Hadoop 
RUN useradd -rm -d /home/hdoop -G sudo -s /bin/bash -p $(openssl passwd -1 hadoop) hdoop
USER hdoop
RUN ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa && \
    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys && \
    chmod 600 ~/.ssh/authorized_keys

# Downloading Hadoop
WORKDIR /home/hdoop
RUN wget http://apachemirror.wuchna.com/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz && \
    tar xzf hadoop-3.3.0.tar.gz && \
    rm hadoop-3.3.0.tar.gz

# Setting Env Variables for Hadoop
ENV HADOOP_HOME=/home/hdoop/hadoop-3.3.0
ENV HADOOP_INSTALL=$HADOOP_HOME
ENV HADOOP_MAPRED_HOME=$HADOOP_HOME
ENV HADOOP_COMMON_HOME=$HADOOP_HOME
ENV HADOOP_HDFS_HOME=$HADOOP_HOME
ENV YARN_HOME=$HADOOP_HOME
ENV HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
ENV HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib"
ENV HADOOP_CLASSPATH=$JAVA_HOME/lib/tools.jar
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
ENV CLASSPATH="$HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-client-core-3.3.0.jar:$HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-client-common-3.3.0.jar:$HADOOP_HOME/share/hadoop/common/hadoop-common-3.3.0.jar:~/MapReduceTutorial/SalesCountry/*:$HADOOP_HOME/lib/*:$CLASSPATH"
ENV PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin

# Copying Hadoop Config Files
COPY config/hadoop/ hadoop-3.3.0/etc/hadoop/

# Downloading Hive
RUN wget http://apachemirror.wuchna.com/hive/hive-3.1.2/apache-hive-3.1.2-bin.tar.gz && \
    tar xzf apache-hive-3.1.2-bin.tar.gz && \
    rm apache-hive-3.1.2-bin.tar.gz

# Setting Env Variables for Hive
ENV HIVE_HOME="/home/hdoop/apache-hive-3.1.2-bin"
ENV PATH=$PATH:$HIVE_HOME/bin

# Copying Hadoop Config Files
COPY config/hive/ apache-hive-3.1.2-bin/
RUN rm $HIVE_HOME/lib/guava-19.0.jar $HIVE_HOME/lib/log4j-slf4j-impl-2.10.0.jar && \
    cp $HADOOP_HOME/share/hadoop/hdfs/lib/guava-27.0-jre.jar $HIVE_HOME/lib/

# Exposing port to Host System
EXPOSE 9870
EXPOSE 9000

# Finishing Up
RUN echo PS1="'${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\W\[\033[00m\]\$ '" >> ~/.bashrc && \
    echo "alias la='ls -la'" >> ~/.bashrc && \
    echo "alias hadoopc='hadoop com.sun.tools.javac.Main'" >> ~/.bashrc && \
    echo "clear" >> ~/.bashrc
WORKDIR /home/hdoop/workspace

# Add any extensions here

# =========================

COPY startup.sh /home/hdoop/startup.sh
ENTRYPOINT [ "/home/hdoop/startup.sh" ]