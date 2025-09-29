# 인제대학교 산학협력 미니프로젝트

### (주) 코웨이 CEO 한석영 대표 와 인제대 컴퓨터공학 학부생들과 협업

REACT NATIVE 기반 모바일 플랫폼

<img src="./assets/images/icon.png" width="200" height="200"/>

건강관련 플랫폼, 사용자에게 맞춤 식단 추천 및 레시피 제공, 레시피에 필요한 재료 구매 페이지 까지 연결

## 환경 설정

### API 설정

```typescript
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";
```

### 개발 환경 설정

1. 프로젝트 루트에 `.env` 파일을 생성하세요
2. 다음 내용을 추가하세요:

```
API_BASE_URL=http://your-api-server-url:port
```
