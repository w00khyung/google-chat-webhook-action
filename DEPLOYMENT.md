# GitHub Actions 마켓플레이스 배포 가이드

이 문서는 Google Chat Webhook Action을 GitHub Actions 마켓플레이스에 배포하는 방법을 설명합니다.

## 배포 전 준비사항

### 1. 레포지토리 설정

```bash
# 새로운 GitHub 레포지토리 생성 (github.com에서)
# 레포지토리 이름: google-chat-webhook-action

# 로컬 레포지토리 초기화 및 연결
git init
git add .
git commit -m "feat: Google Chat Webhook Action 초기 버전"
git branch -M main
git remote add origin https://github.com/w00khyung/google-chat-webhook-action.git
git push -u origin main
```

### 2. 빌드 스크립트 실행

```bash
# 의존성 설치
npm install

# 빌드 실행 (dist/index.js 생성)
npm run build

# 변경사항 커밋
git add dist/
git commit -m "build: dist 파일 추가"
git push
```

### 3. 태그 생성

```bash
# 첫 번째 릴리즈 태그 생성
git tag -a v1.0.0 -m "v1.0.0: 첫 번째 릴리즈"
git push origin v1.0.0

# 메이저 버전 태그도 함께 생성 (사용자가 v1을 사용할 수 있도록)
git tag -a v1 -m "v1: 메이저 버전 태그"
git push origin v1
```

## 마켓플레이스 배포

### 1. GitHub Releases 페이지 접속

1. GitHub 레포지토리 페이지로 이동
2. "Releases" 탭 클릭
3. "Create a new release" 클릭

### 2. 릴리즈 정보 입력

- **Tag version**: `v1.0.0` (위에서 생성한 태그)
- **Release title**: `Google Chat Webhook Action v1.0.0`
- **Description**:

  ````markdown
  ## 🎉 첫 번째 릴리즈

  GitHub Actions에서 Google Chat으로 cardsV2 형식의 아름다운 알림을 보낼 수 있는 액션입니다.

  ### ✨ 주요 기능

  - Google Chat cardsV2 형식 지원
  - 레포지토리, 액션 실행, 커밋 링크 자동 생성
  - 커스터마이징 가능한 제목과 메시지
  - 배포 성공/실패 알림 지원

  ### 📖 사용법

  ```yaml
  - name: Send Google Chat notification
    uses: w00khyung/google-chat-webhook-action@v1
    with:
      webhook_url: ${{ secrets.GOOGLE_CHAT_WEBHOOK_URL }}
      title: '배포 시작: ${{ github.repository }}'
  ```
  ````

  자세한 사용법은 [README.md](README.md)를 참고하세요.

  ```

  ```

### 3. 마켓플레이스 배포 옵션

- **☑️ Publish this Action to the GitHub Marketplace** 체크
- **Primary Category**: `Utilities`
- **Secondary Category**: `Monitoring`

### 4. 릴리즈 생성

"Publish release" 버튼을 클릭하여 릴리즈를 생성하면 자동으로 GitHub Actions 마켓플레이스에 등록됩니다.

## 배포 후 확인사항

### 1. 마켓플레이스 페이지 확인

- https://github.com/marketplace/actions/google-chat-webhook-notification 접속
- 액션 정보가 올바르게 표시되는지 확인

### 2. 사용 테스트

다른 레포지토리에서 액션을 테스트해보세요:

```yaml
- name: Test Google Chat Action
  uses: w00khyung/google-chat-webhook-action@v1
  with:
    webhook_url: ${{ secrets.GOOGLE_CHAT_WEBHOOK_URL }}
    title: '테스트 알림'
```

## 업데이트 배포

새 버전을 배포할 때는 다음 과정을 반복합니다:

```bash
# 코드 수정 후
npm run build
git add .
git commit -m "feat: 새로운 기능 추가"
git push

# 새 태그 생성
git tag -a v1.1.0 -m "v1.1.0: 새로운 기능 추가"
git push origin v1.1.0

# 메이저 버전 태그 업데이트
git tag -fa v1 -m "v1: 최신 버전으로 업데이트"
git push origin v1 --force
```

그 후 GitHub Releases에서 새 릴리즈를 생성합니다.

## 주의사항

1. **dist/ 폴더 포함**: 빌드된 파일이 레포지토리에 포함되어야 합니다.
2. **태그 규칙**: semantic versioning (v1.0.0, v1.1.0, v2.0.0 등)을 따르세요.
3. **메이저 버전 태그**: 사용자가 `@v1`으로 사용할 수 있도록 메이저 버전 태그도 관리하세요.
4. **테스트**: 배포 전에 충분히 테스트하세요.
5. **문서화**: README.md를 항상 최신 상태로 유지하세요.
