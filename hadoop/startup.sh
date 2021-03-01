#!/bin/bash

echo "Initializing Container."

if [ ! -d "/home/hdoop/dfsdata/namenode" ] 
then
    hdfs namenode -format
fi

echo "hadoop" | sudo -S /etc/init.d/ssh start
/home/hdoop/hadoop-3.3.0/sbin/start-dfs.sh
/home/hdoop/hadoop-3.3.0/sbin/start-yarn.sh
hdfs dfs -mkdir -p /user/hdoop

hdfs dfs -mkdir /tmp
hdfs dfs -chmod g+w /tmp
hdfs dfs -mkdir -p /user/hive/warehouse
hdfs dfs -chmod g+w /user/hive/warehouse

if [ ! -d "/home/hdoop/hivedata/metastore_db" ] 
then
    schematool -initSchema -dbType derby
fi

bash