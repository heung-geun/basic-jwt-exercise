import express from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const app = express();

const SECRET_KEY = 'mySecretKey'; // JWT 생성에 사용할 비밀 키

app.use(express.static(__dirname + '/public'));

// 1. 로그인: JWT 생성
app.get('/login', (req, res) => {
  const user = { id: 123, name: '강나연' }; // 사용자 정보
  const token = jwt.sign(
    user,
    SECRET_KEY,
    { expiresIn: '1h' }, // 1시간 유효
  );
  res.json({ token }); // JWT를 브라우저에 전달
});

// 2. 인증된 사용자만 접근
app.get('/dashboard', (req, res) => {
  const token = req.headers['authorization']; // 요청 헤더에서 JWT 가져옴

  if (!token) return res.status(401).send('로그인이 필요합니다!');

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    console.log('decoded');
    console.log(decoded);
    // 1. { id: 123, name: 'hongGilDong' }
    // 2. { id: 123, name: '곰돌이' }

    if (err) return res.status(403).send('유효하지 않은 토큰입니다.');
    res.send(`환영합니다, ${decoded.name}님!`);
  });
});

app.listen(3000, () => console.log('서버 실행 중!'));
