# Google Chat Webhook Action

Google Chat으로 GitHub Actions 알림을 cardsV2 형식으로 전송하는 액션입니다.

## 기능

- 🔔 GitHub Actions 실행 시 Google Chat으로 자동 알림
- 📱 cardsV2 형식의 아름다운 카드 메시지
- 🔗 레포지토리, 액션 실행, 커밋으로 바로 이동할 수 있는 버튼
- ⚙️ 커스터마이징 가능한 제목과 메시지

## 사용법

### 기본 사용법

```yaml
name: Google Chat Notification
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Google Chat notification
        uses: w00khyung/google-chat-webhook-action@v1
        with:
          webhook_url: ${{ secrets.GOOGLE_CHAT_WEBHOOK_URL }}
          title: '배포 시작: ${{ github.repository }}'
```

### 고급 사용법

```yaml
- name: Send custom notification
  uses: w00khyung/google-chat-webhook-action@v1
  with:
    webhook_url: ${{ secrets.GOOGLE_CHAT_WEBHOOK_URL }}
    title: '🚀 배포 완료'
    subtitle: '프로덕션 환경에 성공적으로 배포되었습니다'
    text: '배포가 완료되었습니다 <users/all>'
```

### 실패 시 알림

```yaml
- name: Notify failure
  if: failure()
  uses: w00khyung/google-chat-webhook-action@v1
  with:
    webhook_url: ${{ secrets.GOOGLE_CHAT_WEBHOOK_URL }}
    title: '❌ 배포 실패'
    text: '배포에 실패했습니다. 확인이 필요합니다.'
```

## 입력 매개변수

| 매개변수       | 필수 | 기본값                       | 설명                    |
| -------------- | ---- | ---------------------------- | ----------------------- |
| `webhook_url`  | ✅   | -                            | Google Chat Webhook URL |
| `title`        | ❌   | `GitHub Action Notification` | 알림 제목               |
| `subtitle`     | ❌   | `""`                         | 알림 부제목             |
| `text`         | ❌   | `""`                         | 플레인 텍스트 메시지    |
| `github_token` | ❌   | `${{ github.token }}`        | GitHub API 토큰         |

## Google Chat Webhook URL 설정

1. Google Chat에서 스페이스를 선택합니다
2. 스페이스 이름 옆의 ▼를 클릭하고 "앱 및 통합 관리"를 선택합니다
3. "Webhook 추가"를 클릭합니다
4. 이름과 아바타를 설정하고 "저장"을 클릭합니다
5. 생성된 Webhook URL을 복사합니다
6. GitHub 레포지토리의 Settings > Secrets and variables > Actions에서 `GOOGLE_CHAT_WEBHOOK_URL`로 추가합니다

## 메시지 형식

이 액션은 다음과 같은 정보를 포함한 카드를 생성합니다:

### 헤더

- 제목 (title)
- 부제목 (커밋 메시지 또는 subtitle)
- GitHub 로고

### 레포지토리 정보

- 레포지토리 이름
- 브랜치 이름
- 워크플로우 이름
- 바로가기 버튼 (레포지토리, 액션 실행, 커밋)

### 실행 정보

- 작성자 이름
- 커밋 SHA (앞 7자리)

## 예시 출력

생성되는 Google Chat 메시지는 다음과 같은 형태입니다:

```json
{
  "text": "배포 시작: myorg/myrepo",
  "cardsV2": [
    {
      "cardId": "github-action-notification",
      "card": {
        "header": {
          "title": "배포 시작: myorg/myrepo",
          "subtitle": "fix: Google Chat 알림 기능 추가",
          "imageUrl": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
          "imageType": "CIRCLE",
          "imageAltText": "GitHub Logo"
        },
        "sections": [...]
      }
    }
  ]
}
```

## 라이선스

MIT License

## 기여하기

1. 이 레포지토리를 포크합니다
2. 피처 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 지원

문제가 있거나 기능 요청이 있으시면 [Issues](https://github.com/w00khyung/google-chat-webhook-action/issues)에 등록해주세요.
