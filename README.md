# 인제대학교 산학협력 미니프로젝트

### (주) 코웨이 CEO 한석영 대표 와 인제대 컴퓨터공학 학부생들과 협업

REACT NATIVE 기반 모바일 플랫폼

<img src="./assets/images/icon.png" width="200" height="200"/>

건강관련 플랫폼, 사용자에게 맞춤 식단 추천 및 레시피 제공, 레시피에 필요한 재료 구매 페이지 까지 연결

## 환경 설정

### API 설정 방법

API URL은 `app.json` 파일에서 설정합니다:

1. `app.json`의 `extra` 섹션에서 API URL을 수정하세요:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://your-api-server-url:port"
    }
  }
}
```

2. 기본값은 `http://localhost:8000`입니다.

### 개발 환경 설정

프로덕션 환경에서는 `app.json`의 `apiBaseUrl`을 실제 서버 URL로 변경하세요.
