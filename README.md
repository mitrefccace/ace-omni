# ACE Omni

ACE Omni is a research platform that enables researchers to create study experiences which emulate existing Telecommunications Relay Services (TRS) solutions or demonstrate novel TRS solutions, as well as manage and access data and other TRS experimental environment set-up tools. ACE Omni makes it easier, faster, and less expensive to conduct comprehensive TRS research by all researchers striving to enable more effective communication for people who are d/Deaf, Hard of Hearing, DeafBlind, or speech impaired.

**Key Benefits:**

- Conduct experiments on the numerous combinations of TRS capabilities​
- Cost and time savings in experimental setup and evaluation​
- Deliver research results faster​
- Defensible conclusions and repeatable data for possible peer review and publishing​
- Lower barriers for conducting TRS research and potentially expanding the TRS research community

ACE Omni was developed using Amazon Web Services (AWS) on a Amazon Linux 2 instance running on a t2.medium Elastic Compute Cloud (EC2) instance.

## Installation

## Pre-Installation Server Requirements

Install dependent packages:

```text
sudo yum install -y git gcc-c++ make
```

Install [Node.js](https://nodejs.org/en/) version 16.20.2

```text
sudo yum install https://rpm.nodesource.com/pub_16.x/nodistro/repo/nodesource-release-nodistro-1.noarch.rpm -y
sudo yum install nodejs -y --setopt=nodesource-nodejs.module_hotfixes=1
node --version
```

Install [MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-amazon/)

Create a `/etc/yum.repos.d/mongodb-org-7.0.repo` file

```text
sudo vi /etc/yum.repos.d/mongodb-org-7.0.repo
```

Paste the content below into the new file:

```text
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
```

Save file

To install and start the mongodb service run:

```text
sudo yum install -y mongodb-org
sudo systemctl start mongod
sudo systemctl status mongod
sudo systemctl enable mongod
```

## ACE Omni Software Installation

Clone the ACE Omni repository the change directory to the ACE Omni project:

```text
git clone ssh://git@git.codev.mitre.org/acedev/ace-omni.git
-- OR --
git clone https://git.codev.mitre.org/scm/acedev/ace-omni.git

cd ace-omni
```

### Install the ACE Omni Dependencies

```text
npm install
cd aceomni-client/
npm install
```

### Configure ACE Omni server

ACE Omni has two configuration files `config.js` and `aceomni-client/.env`

Create the `config.js` file:

```text
cp config.js.template config.js
vi config.js
```

config.js glossary

|   Name                    | Type    |  Description                                             |
| ------------------------- | ------- | -------------------------------------------------------- |
| config.port               | int     | Port node.js server will listen on. Default 9000         |
| config.environment        | string  | Environment "DEV" or "PROD"                              |
| config.ssl.enabled        | boolean | Run node.js server with http or https                    |
| config.ssl.cert           | string  | Path to SSL certificate file (Required if ssl is enabled)|
| config.ssl.key            | string  | Path to SSL private key file (Required if ssl is enabled)|
| config.mongodb.connection | string  | The mongodb connection string                            |
| config.session.name       | string  | The name of the session ID cookie to set in the response |
| config.session.secret     | string  | The secret used to sign the session ID cookie            |

Create the `aceomni-client/.env` file:

```text
cp aceomni-client.env.template aceomni-client/.env
vi aceomni-client/.env
```

aceomni-client/.env glossary

| Name                 | Description                               | Example                 |
| -------------------- | ----------------------------------------- | ----------------------- |
| REACT_APP_LOCATION   | The nginx location path                   | /omni                   |
| PORT                 | The port when running in develop mode     | 9006                    |
| REACT_APP_PROXY_HOST | The node.js app listening host and port   | <http://localhost:9000> |
| REACT_APP_FQDN       | The FQDN for the host                     | your-omni-domain.com    |
| REACT_APP_TURN_USER  | Turn server username\*                    | turnuser                |
| REACT_APP_TURN_PASS  | Turn server password\*                    | turn-server-password    |
| REACT_APP_TURN_FQDN  | Turn server fqdn\*                        | myturnserver.com        |
| REACT_APP_TURN_PORT  | Turn server port\*                        | 3478                    |
| REACT_APP_STUN_FQDN  | Stun server fqdn\*                        | stun.l.google.com       |
| REACT_APP_STUN_PORT  | Stun server port\*                        | 19302                   |

- ACE Omni requires a TURN **or** STUN, not both. Delete the configurations for the one not being used.

## Create the ACE Omni Admin Account

ACE Omni requires an admin account to manage the ACE Omni user accounts and Cloud Service Provider configurations. To create this account run the following command, then follow the on screen instructions.

```text
node scripts/manageAdmins.js
```

## Starting ACE Omni

### For Development

Verify the config.js is configured for the "DEV" environment. Then run the following command:

```text
npm run dev
```

NGINX Configurations for Development:

```text
 location /dev/omni/ {
    proxy_pass http://localhost:9006/;
    proxy_set_header Accept-Encoding "";

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;

    sub_filter_once off;
    sub_filter_types *;
    sub_filter 'src=\"/' 'src=\"/dev/omni/';
    sub_filter "src=\'/" "src=\'/dev/omni/";
    sub_filter 'href=\"/' 'href=\"/dev/omni/';
    sub_filter "href=\'/" "href=\'/dev/omni/";
    sub_filter 'href: "/' 'href: "/dev/omni/';
    sub_filter 'this.client = new WebSocket(url);' 'this.client = new WebSocket("wss://myaceomnidomain.com/dev/omni/ws");';
    sub_filter '__webpack_require__.p = "/"' '__webpack_require__.p = "/dev/omni/"';

    proxy_redirect http://localhost:9006/dev/omni/ /dev/omni/;
}
```

### For Production

Verify the config.js is configured for the "PROD" environment. Then run the following commands:

```text
cd aceomni-client/
npm run build
cd ..
npm start
```

PM2 can be used to run and manage ACE Omni. To use pm2 rather than `npm start` run the following command:

```text
npm install pm2 -g
pm2 start process.json
```

NGINX configurations for Production:

```text
location /omni/ {
    proxy_pass http://localhost:9000/;
    proxy_set_header Accept-Encoding "";

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;

    sub_filter_once off;
    sub_filter_types *;
    sub_filter 'src="/' 'src="/omni/';
    sub_filter "src='/" "src='/omni/";
    sub_filter 'href="/' 'href="/omni/';
    sub_filter "href='/" "href='/omni/";
    sub_filter 'href: "/' 'href: "/omni/';
    sub_filter 'url(/static' 'url(/omni/static';
          
    proxy_redirect http://localhost:9000/omni/ /omni/;
}     
```

```
                                 NOTICE
This (software/technical data) was produced for the U. S. Government under
Contract Number 75FCMC18D0047, and is subject to Federal Acquisition
Regulation Clause 52.227-14, Rights in Data-General. No other use other than
that granted to the U. S. Government, or to those acting on behalf of the U. S.
Government under that Clause is authorized without the express written
permission of The MITRE Corporation. For further information, please contact
The MITRE Corporation, Contracts Management Office, 7515 Colshire Drive,
McLean, VA  22102-7539, (703) 983-6000.
                        ©2024 The MITRE Corporation. 
                        
Approved for Public Release; Distribution Unlimited 24-0463
```
