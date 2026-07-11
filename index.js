import 'dotenv/config';
import fs from 'fs';
import sharp from 'sharp';
import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;

const client = new WOLF();

await client.login(
  "m22@gmail.com",
  "As111a",
  "000",
  OnlineState.ONLINE,
  LoginType.SNAPCHAT
);
