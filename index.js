const fs = require('fs').promises;
const axios = require('axios');

const j88Config = {
  name: 'J88',
  file: 'files/j88.txt',
  dl_file: "files/j88_deleted.txt",
  api: 'https://api.adavawef.top/Promotion/Check200k',
  origin: 'https://j88k8.app',
  referer: 'https://j88k8.app/'
};

const eightKConfig = {
  name: '8K',
  file: 'files/8k.txt',
  dl_file: "files/8k_deleted.txt",
  api: 'https://cjw242c.kmncksje.top/Promotion/Check200k',
  origin: 'https://google8ksp50k.vip',
  referer: 'https://google8ksp50k.vip/'
};

async function readUsernames(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return data
    .split('\n')
    .map(line => line.trim().split(/\s+/)[0])  // lấy từ đầu tiên trên mỗi dòng
    .filter(Boolean);

}

async function writeUsernames(filePath, usernames) {
  await fs.writeFile(filePath, usernames.join('\n'), 'utf8');
}

async function checkUser(account, config) {
  try {
    const response = await axios.post(config.api, { Account: account }, {
      headers: {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8,...',
        'content-type': 'application/json',
        'origin': config.origin,
        'referer': config.referer,
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...'
      }
    });

    const { code, message } = response.data;
    console.log(`[${config.name}] ${account} → ${message}`);

    if (message.includes("không đủ điều kiện nhận thưởng")) {

      return false;

    }

    return true;


  } catch (error) {
    console.error(`[${config.name}] ${account} → Lỗi khi gửi request:`, error.message);
    return false;
  }
}

async function runCheck(config) {
  const allLines = (await fs.readFile(config.file, 'utf8'))
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);


  // const usernames = await readUsernames(config.file);
  const validUsers = [];
  const invalidUsers = [];

  for (const line of allLines) {
    const username = line.split(/\s+/)[0];
    const isValid = await checkUser(username, config);
    if (isValid) {
      validUsers.push(line);
    } else {
      invalidUsers.push(line);
    }
  }

  await writeUsernames(config.file, validUsers);
  await writeUsernames(config.dl_file, invalidUsers);
  console.log(`\n[${config.name}] Đã cập nhật file ${config.file} với ${validUsers.length} tài khoản hợp lệ.\n`);
}

async function main() {
  await runCheck(j88Config);
  await runCheck(eightKConfig);
}

main().catch(console.error);
