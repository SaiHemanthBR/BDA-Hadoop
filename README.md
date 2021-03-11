# Apache Hadoop Installation

Wanna install Hadoop? Huh. Well there are 3 ways to do it.

## Method 1: Using Linux/macOS
The best way is to not use windows. Use linux or macOS and follow the steps in Method 3. (What is windows, anyway?)
<br><br>

## Method 2: Using Docker
Well, the second best way is to use Docker. It's only 3 steps

### Steps:

  1. Download and install Docker Desktop from the link below <br>
  [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

  2. After the installation is done. <br>
      > *Note: Always run the following commands from the same working directory. It will create two directories `workspace` and `dfsdata` which are used by docker. (Recommended to run in HOME dir)*
      macOS (unix) or linux users, run the following command:
      ```
      docker run --name hadoop --rm -it -p 9870:9870 -p 8088:8088 -v "$(pwd)/workspace":"/home/hdoop/workspace" -v "$(pwd)/dfsdata":"/home/hdoop/dfsdata" -v "$(pwd)/hivedata":"/home/hdoop/hivedata/" saihemanthbr/hadoop
      ```
      Its a single line. You can save it to a .sh file and run that file 
      ([Click here to download](https://gist.github.com/SaiHemanthBR/f765395e751b3813ca3287844816ce78#file-run_hadoop-sh))

      Windows users (others), run the following the command:
      > *Note: Always run the following commands from the same working directory. It will create two directories `workspace` and `dfsdata` which are used by docker. (Recommended to run in C:/ drive)*
      ```
      docker run --name hadoop --rm -it -p 9870:9870 -p 8088:8088 -v "%cd%"/workspace:"/home/hdoop/workspace" -v "%cd%"/dfsdata:"/home/hdoop/dfsdata" -v "%cd%"/hivedata:"/home/hdoop/hivedata" saihemanthbr/hadoop
      ```
      Its a single line. You can save it to a .bat file and run that file
      ([Click here to download](https://gist.github.com/SaiHemanthBR/f765395e751b3813ca3287844816ce78#file-run_hadoop-bat))
  
  3. Sit back and watch Youtube/Prime/Netflix while Docker downloads and install Apache Hadoop. (It's a 3GB download)

## Method 3: Using VirtualBox
Oh! Nice I see you selected the worst method. Ok then, let's go.

Lets follow the steps assuming, you have installed Ubuntu on VirtualBox.

What? You haven't? Don't worry, [Follow this](https://github.com/SaiHemanthBR/.LPLab/blob/master/VM_Install.pdf)

> *Note: Don't type the `~ $` in the commands below. Type command following `$`*

> *Note: `~` means you need to be in HOME dir (use `cd` to quickly get to HOME dir). It is used to denote the pwd of the terminal*

### Steps:

  1. Download Apache Hadoop from the link below.
  [https://www.apache.org/dyn/closer.cgi/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz](https://www.apache.org/dyn/closer.cgi/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz) <br>
  or, if you can type the command below
      ```
      ~ $ wget http://apachemirror.wuchna.com/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz
      ```
      Use the Command, its easier

  2. While that .tarball is downloading, we need to do some pre-setup stuff. (In a new terminal tab)

  **Pre-Setup**

  3. We need to install Java 8. We'll use OpenJDK because its easier to install. So run the following command (in terminal, ofcourse).
      ```
      ~ $ apt-get update
      ~ $ apt-get install -y openjdk-8-jdk
      ```
  
  4. By default SSH Client is installed in linux, but we also need to make sure SSH Server is installed. This is used by hadoop.
      ```
      ~ $ apt-get install -y openssh-server openssh-client
      ```
  
  5. Now we need to do some config for OpenSSH to work properly. So run the following commands
      ```
      ~ $ ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
      ~ $ cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
      ~ $ chmod 600 ~/.ssh/authorized_keys
      ```
      Now, also start the OpenSSH-server by running
      ```
      ~ $ sudo /etc/init.d/ssh start
      ```
      This needs to be done only once.
  
  **Installation**

  6. Now, find where the `hadoop-3.3.0.tar.gz` is downloaded. If you downloaded using link, it will be ~/Downloads folder 
      ```
        ~ $ mv ~/Downloads/hadoop-3.3.0.tar.gz .
      ```
  <br>or<br> 
  if you used the command it will be in your home directory (hopefully).

  7. Now, we need to extract it. So run
      ```
        tar xzf hadoop-3.3.0.tar.gz
      ```
      This will extract the .tar file contents into hadoop-3.3.0 folder
    
  8. To make sure, run `ls` commands and the output should be 
      ```
        ~ $ ls
        Documents Pictures hadoop-3.3.0.tar.gz hadoop-3.3.0 Downloads Music
      ```
      This won't be the exact output but make sure you can see `hadoop-3.3.0` dir.
  
  **Configuration**

  You can download these config files from [here](https://gist.github.com/SaiHemanthBR/d9badbd36bc830d83cab874ed48bffb5). This will make it easy for you to add config files

  9. You now need to add some Environment Variables to .bashrc file, so run the following command.
      ```
      ~ $ gedit ~/.bashrc
      ```
      This will open .bashrc file in gedit, now add the following text to the end of the file. Make sure to edit the username in the firstline

      ```
      # Copy this files content to the end of ~/.bashrc
      # change the username. HADOOP_HOME=/home/{username}/hadoop-3.3.0
      export HADOOP_HOME=/home/ubuntu/hadoop-3.3.0
      export HADOOP_INSTALL=$HADOOP_HOME
      export HADOOP_MAPRED_HOME=$HADOOP_HOME
      export HADOOP_COMMON_HOME=$HADOOP_HOME
      export HADOOP_HDFS_HOME=$HADOOP_HOME
      export YARN_HOME=$HADOOP_HOME
      export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
      export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib"
      export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin
      export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
      export CLASSPATH="$HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-client-core-3.3.0.jar:$HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-client-common-3.3.0.jar:$HADOOP_HOME/share/hadoop/common/hadoop-common-3.3.0.jar:~/MapReduceTutorial/SalesCountry/*:$HADOOP_HOME/lib/*:$CLASSPATH"
      export HADOOP_CLASSPATH=$JAVA_HOME/lib/tools.jar
      ```
      This above content is also in [exports](https://gist.github.com/SaiHemanthBR/d9badbd36bc830d83cab874ed48bffb5#file-exports) file.
  
  10. Now, to load those Environment Variables into the current terminal session, run
      ```
      ~ $ source ~/.bashrc
      ```
  
  11. Now that is done, `cd` into `$HADOOP_HOME/etc/hadoop` by running the following command
      ```
      ~ $ cd $HADOOP_HOME/etc/hadoop
      ~/hadoop-3.3.0/etc/hadoop $
      ```
  
  12. Now open and edit `hadoop-env.sh` file
      ```
      ~/hadoop-3.3.0/etc/hadoop $ gedit hadoop-env.sh
      ```
      This will open .bashrc file in gedit, now modify `line 54` as follows
      ```
        export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
      ```
      This above file can be downloaded from here: [hadoop-env.sh](https://gist.github.com/SaiHemanthBR/d9badbd36bc830d83cab874ed48bffb5#file-hadoop-env-sh) and simply copied into `~/hadoop-3.3.0/etc/hadoop`
  
  13. Now open and edit `core-site.xml` file
      ```
      ~/hadoop-3.3.0/etc/hadoop $ gedit core-site.xml
      ```
      This will open .bashrc file in gedit, now add the following content into `<configuration> </configuration>` tags
      ```
      <configuration>
        <property>
          <name>hadoop.tmp.dir</name>
          <!-- Dont forget to change the username. Path should be /home/{username}/tmpdata -->
          <value>/home/hdoop/tmpdata</value>
        </property>
        <property>
          <name>fs.default.name</name>
          <value>hdfs://127.0.0.1:9000</value>
        </property>
      </configuration>
      ```
      This above file can be downloaded from here: [core-site.xml](https://gist.github.com/SaiHemanthBR/d9badbd36bc830d83cab874ed48bffb5#file-core-site-xml) and simply copied into `~/hadoop-3.3.0/etc/hadoop`
  
  14. Now open and edit `hdfs-site.xml` file
      ```
      ~/hadoop-3.3.0/etc/hadoop $ gedit hdfs-site.xml
      ```
      This will open .bashrc file in gedit, now add the following content into `<configuration> </configuration>` tags
      ```
      <configuration>
        <property>
          <name>dfs.name.dir</name>
          <!-- Dont forget to change the username. Path should be /home/{username}/dfsdata/namenode -->
          <value>/home/hdoop/dfsdata/namenode</value>
        </property>
        <property>
          <name>dfs.data.dir</name>
          <!-- Dont forget to change the username. Path should be /home/{username}/dfsdata/datanode -->
          <value>/home/hdoop/dfsdata/datanode</value>
        </property>
        <property>
          <name>dfs.replication</name>
          <value>1</value>
        </property>
      </configuration>
      ```
      This above file can be downloaded from here: [hdfs-site.xml](https://gist.github.com/SaiHemanthBR/d9badbd36bc830d83cab874ed48bffb5#file-hdfs-site-xml) and simply copied into `~/hadoop-3.3.0/etc/hadoop`
  
  15. Now open and edit `mapred-site.xml` file
      ```
      ~/hadoop-3.3.0/etc/hadoop $ gedit mapred-site.xml
      ```
      This will open .bashrc file in gedit, now add the following content into `<configuration> </configuration>` tags
      ```
      <configuration> 
        <property> 
          <name>mapreduce.framework.name</name> 
          <value>yarn</value> 
        </property> 
      </configuration>
      ```
      This above file can be downloaded from here: [mapred-site.xml](https://gist.github.com/SaiHemanthBR/d9badbd36bc830d83cab874ed48bffb5#file-mapred-site-xml) and simply copied into `~/hadoop-3.3.0/etc/hadoop`
  
  16. Now open and edit `yarn-site.xml` file
      ```
      ~/hadoop-3.3.0/etc/hadoop $ gedit yarn-site.xml
      ```
      This will open .bashrc file in gedit, now add the following content into `<configuration> </configuration>` tags
      ```
      <configuration>
        <property>
          <name>yarn.nodemanager.aux-services</name>
          <value>mapreduce_shuffle</value>
        </property>
        <property>
          <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
          <value>org.apache.hadoop.mapred.ShuffleHandler</value>
        </property>
        <property>
          <name>yarn.resourcemanager.hostname</name>
          <value>0.0.0.0</value>
        </property>
        <property>
          <name>yarn.acl.enable</name>
          <value>0</value>
        </property>
        <property>
          <name>yarn.nodemanager.env-whitelist</name>   
          <value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CONF_DIR,CLASSPATH_PERPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_MAPRED_HOME</value>
        </property>
      </configuration>
      ```
      This above file can be downloaded from here: [yarn-site.xml](https://gist.github.com/SaiHemanthBR/d9badbd36bc830d83cab874ed48bffb5#file-yarn-site-xml) and simply copied into `~/hadoop-3.3.0/etc/hadoop`
  
  Finally, congratulate yourself mate for making this far. We aren't done yet tho.

  17. Come back to HOME dir by running:
      ```
        ~/hadoop-3.3.0/etc/hadoop $ cd
        ~ $
      ```

  18. We need to format `hadoop dfs`, this is similar to formating a pendrive or HDD or SSD. To do this run,
      ```
      ~ $ hdfs namenode -format
      ```
      If this is done without any error, you will see a shutdown notification as follows.
      ```
      /******************************************************
      SHUTDOWN_MSG: Shutting down NameNode at Anakin-VM/127.0.1.1
      *******************************************************/
      ```
      You might not see `Anakin-VM`. This is my computer name, so will see your computer name.
  
  **Startup**
  
  19. Now, run the following to commands to start Hadoop
      ```
      ~ $ start-dfs.sh
      Starting namenodes on [localhost]
      Starting datanodes
      Starting secondary namenodes [ca1d73971731]
      2020-08-06 18:53:49,501 WARN util.NativeCodeLoader: ...
      ```

      ```
      ~ $ start-yarn.sh
      Starting resourcemanager
      Starting nodemanagers
      ```
  
  20. To check if all the processors are running, run
      ```
      ~ $ jps
      1904 NameNode
      2900 Jps
      2217 SecondaryNameNode
      2537 NodeManager
      2042 DataNode
      2426 ResourceManager
      ```
      The numbers or order can be different, but those 6 process need to be running.
  
  21. To access, Hadoop Cluster Web Console, goto `http://localhost:8088` 
  <br>and<br>
  To access, Hadoop Datanode Status page, goto `http://localhost:9870`

<br><br>
That's it, congraulations, its done.

or you could have just used Docker. hmmmmmm



  
    