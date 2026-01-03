FROM node:20-alpine as builder
WORKDIR /app
#캐싱 최적화 : package.json이 안바뀌면 npm install 패스
COPY package*.json ./
RUN npm install

#소스 복사 및 빌드
COPY . .
RUN npm run build

# 2. 실행 단계 (정적 파일 서빙용 Nginx)
FROM nginx:alpine
# 빌드 결과물을 Nginx의 기본 폴더로 복사
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA 라우팅 처리를 위한 설정 파일 복사 (아래 2번 참조)
#COPY nginx.conf /etc/nginx/conf.d/default.conf
# Nginx 기본 설정은 80포트로 파일을 서빙하므로 설정 파일 복사도 필요 없음 (기본값 사용)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]