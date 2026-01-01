FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. 실행 단계 (정적 파일 서빙용 Nginx)
FROM nginx:alpine
# 빌드 결과물을 Nginx의 기본 폴더로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 기본 설정은 80포트로 파일을 서빙하므로 설정 파일 복사도 필요 없음 (기본값 사용)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]