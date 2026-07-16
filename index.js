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
const FILE_PATH = './avatar.gif';

client.on('ready', async () => {
  console.log('✅ Bot connected\n');

  // 1) اطبع وقت السيرفر مقابل وقت الجهاز المحلي (مهم جدًا لـ AWS SigV4)
  console.log('🕐 System time (local):', new Date().toISOString());

  // 2) اجبر تجديد توكن Cognito (forceNew = true)
  const cognito = await client.misc.getSecurityToken(true);
  console.log('🔑 Cognito identity:', cognito.identity);
  console.log('🔑 Cognito token (first 30 chars):', cognito.token?.substring(0, 30) + '...');
  console.log('');

  const buffer = fs.readFileSync(FILE_PATH);
  const { mime } = await fileTypeFromBuffer(buffer);
  const avatarConfig = client._frameworkConfig.get('multimedia.avatar.channel');

  console.log('📦 Endpoint:', client.config.endpointConfig.mmsUploadEndpoint);
  console.log('📦 Route:', `/v${avatarConfig.version}/${avatarConfig.route}`);
  console.log('');

  // 3) اعمل axios client يدوي زي اللي في المكتبة بالظبط، بس اطبع الخطأ الكامل
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

    console.log('✅ SUCCESS:', response.data);
  } catch (error) {
    console.log('❌ FULL ERROR DETAILS:');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Response Data (RAW):', error.response?.data);
    console.log('Response Headers:', JSON.stringify(error.response?.headers, null, 2));
    console.log('Error Message:', error.message);
    console.log('Request URL:', error.config?.url);
    console.log('Request BaseURL:', error.config?.baseURL);
  }

  client.logout();
});

client.login();
