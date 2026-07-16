import { WOLF } from 'wolf.js';
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import axios from 'axios';
import { aws4Interceptor } from 'aws4-axios';
import { CognitoIdentityClient, NotAuthorizedException } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentity } from '@aws-sdk/credential-provider-cognito-identity';

const client = new WOLF();
client.config.framework.login.email = process.env.U_MAIL;
client.config.framework.login.password = process.env.U_PASS;

const CHANNEL_ID = 81889058;
const FILE_PATH = './test.jpg';   // <<<<< التغيير الوحيد هنا

client.on('ready', async () => {
  console.log('✅ Bot connected\n');

  const cognito = await client.misc.getSecurityToken(true);

  const buffer = fs.readFileSync(FILE_PATH);
  const { mime } = await fileTypeFromBuffer(buffer);
  const avatarConfig = client._frameworkConfig.get('multimedia.avatar.channel');

  console.log('Mime:', mime);

  const axiosClient = axios.create();

  axiosClient.interceptors.request.use(
    aws4Interceptor({
      instance: axios,
      options: { region: 'eu-west-1', service: 'execute-api' },
      credentials: {
        getCredentials: async () => {
          const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentity({
              client: new CognitoIdentityClient({ region: 'eu-west-1' }),
              identityId: cognito.identity,
              logins: { 'cognito-identity.amazonaws.com': cognito.token }
            })
          });
          return await cognitoIdentity.config.credentials();
        }
      }
    })
  );

  try {
    const response = await axiosClient({
      method: 'POST',
      baseURL: client.config.endpointConfig.mmsUploadEndpoint,
      url: `/v${avatarConfig.version}/${avatarConfig.route}`,
      data: {
        body: {
          data: buffer.toString('base64'),
          mimeType: mime,
          id: parseInt(CHANNEL_ID),
          source: client.currentSubscriber.id
        }
      }
    });

    console.log('✅ RESULT:', response.data);
  } catch (error) {
    console.log('❌ ERROR:', error.response?.data || error.message);
  }

  client.logout();
});

client.login();
