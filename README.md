# 콕콕 — 캐릭터 터치 게임

자기 캐릭터 그림을 넣고 터치 영역, 대사, 표정, 호감도를 설정하는 웹게임입니다.
GitHub에 업로드할 수 있는 소스와 **GitHub Pages용 완성 파일(`docs/`)**이 함께 들어 있습니다.

## 1. 가장 간단하게 GitHub Pages로 열기

컴퓨터에서 압축을 풀고 아래 순서로 진행하세요. ZIP 파일 자체를 올리면 사이트가 실행되지 않습니다.

1. GitHub에서 **New repository**를 눌러 공개(Public) 저장소를 만듭니다. 이름 예: `kokkok`.
2. 저장소의 **Add file → Upload files**를 선택합니다.
3. 압축 안 `kokkok-github` 폴더의 **내용물**을 업로드합니다. 저장소 맨 위에 `docs`, `src`, `backend`, `package.json`, `README.md`가 보여야 합니다. 폴더를 한 단계 더 감싸지 마세요.
4. **Commit changes**를 누릅니다.
5. **Settings → Pages → Build and deployment**에서 Source를 **Deploy from a branch**로 선택합니다.
6. Branch는 **main**, 폴더는 **/docs**로 고르고 **Save**를 누릅니다.
7. 배포가 끝나면 Pages 설정에 실제 사이트 주소가 표시됩니다. 보통 `https://아이디.github.io/저장소이름/` 형태입니다.

**주소에 chatgpt는 들어가지 않습니다.** `.github` 설정이나 별도 Actions 워크플로는 필요 없습니다.
GitHub Pages 공개 저장소의 무료 제공 범위 안에서 사용할 수 있습니다.

### 바로 가능한 것 / 서버 연결이 필요한 것

| 기능 | GitHub Pages만 사용 | 공유 저장 서버 연결 후 |
| --- | --- | --- |
| 캐릭터·기쁨·부끄·화남 이미지 등록 | 가능 | 가능 |
| 영역 배치, 부위별 대사·표정 설정 | 가능 | 가능 |
| 호감도 및 부위 해금 | 가능 | 가능 |
| 마지막 터치 2초 후 기본 표정 복귀 | 가능 | 가능 |
| 현재 브라우저에 작업 저장 | 가능 | 가능 |
| 이미지와 설정을 저장해 다른 기기로 공유 | 불가 | 가능 |

GitHub Pages는 HTML/CSS/JS를 제공하는 정적 호스팅이라 업로드 저장 API를 실행하지 못합니다.
서버를 연결하기 전에는 '공유 링크 만들기'를 누르면 연결 안내를 표시합니다.
기기 작업 저장은 브라우저 저장 공간 한도의 영향을 받습니다.

## 2. 공유 기능 연결 — Cloudflare Workers + R2

이 단계는 GitHub 업로드와 별개이며, Cloudflare 계정과 Node.js 설치가 필요합니다.
**외부 계정 생성·저장소 생성·배포는 이 압축 파일만으로 자동 완료되지 않습니다.**
Workers와 R2에는 무료 사용량이 있지만 R2 활성화 시 결제 수단을 요구할 수 있고, 무료량 초과 시 비용이 발생할 수 있습니다. 비용이 전혀 발생하지 않는 운영을 보장하지 않습니다. 원하지 않으면 이 단계 없이 기기 내 편집·플레이만 사용하세요.

터미널에서 프로젝트 폴더를 열고:

```sh
npm install
npx wrangler login
npx wrangler r2 bucket create kokkok-games
```

`backend/wrangler.jsonc`의 `YOUR_GITHUB_USERNAME`을 실제 GitHub 아이디로 바꿉니다.
예: `https://myname.github.io` — 뒤에 `/kokkok/` 같은 경로는 붙이지 않습니다.
원하는 버킷 이름이 다르면 생성 명령과 `bucket_name`을 함께 바꿉니다.

```sh
npm run api:deploy
```

명령 출력에서 **실제로 발급된 Workers 주소**를 복사합니다.
GitHub의 `docs/config.js`를 편집해 빈 문자열에 그 주소를 넣습니다:

```js
window.KOKKOK_API_URL = "https://실제로-발급된-서버-주소";
```

`/api/games`를 뒤에 붙이지 마세요. 토큰·비밀 키도 넣지 마세요.
`public/config.js`에도 같은 값을 넣어두면 다음 빌드 때 유지됩니다.
변경을 Commit한 뒤 Pages 배포가 끝나면 사이트를 새로고침합니다.

이제 이미지·설정 입력 → **공유 링크 만들기** → 복사한 GitHub Pages 링크를 다른 기기에서 열 수 있습니다.
공유 링크는 해당 설정을 열람하는 링크입니다. 이미지를 넣어 공유하면 링크를 아는 사람이 이미지를 볼 수 있습니다.
이 버전은 로그인·관리자 화면·게시물 삭제 UI를 포함하지 않습니다. 운영 규모가 커지면 계정별 권한과 사용량 제한 등을 추가해야 합니다.

### 기존 사이트에서 만든 링크와 작업

이 압축 파일은 **코드만** 포함합니다. 기존 서비스에 저장한 이미지·게임 데이터·브라우저 작업은 자동 이전되지 않습니다.
기존 공유 링크의 도메인만 GitHub 주소로 바꾸면 게임을 찾을 수 없습니다.
새 사이트에서 이미지와 설정을 등록하고 새 공유 링크를 만드세요.

## 3. 소스 수정·로컬 실행

Node.js 22.13 이상(또는 24 LTS)을 설치합니다.

```sh
npm install
npm run dev
```

터미널에 출력된 로컬 주소를 엽니다. 이미지 파일을 넣어 만들기·플레이를 테스트할 수 있습니다.
로컬 공유 API는 별도 터미널에서 다음 명령으로 실행합니다:

```sh
npm run api:dev
```

`public/config.js`의 주소를 Wrangler가 출력한 로컬 API 주소로 바꿉니다.
로컬 R2 데이터는 실제 배포 저장소와 분리됩니다.

```sh
npm test
npm run build
```

`npm run build`는 `docs/`를 다시 만듭니다. `public/config.js`의 내용도 복사됩니다.
소스를 수정한 뒤에는 **변경된 소스와 새 docs 폴더를 함께** GitHub에 올려야 화면에 반영됩니다.
정적 `docs/index.html`을 파일로 직접 더블클릭하지 말고 Pages 또는 로컬 개발 서버에서 열어주세요.

## 파일 구성

- `docs/`: Pages에 바로 배포할 완성 파일. 직접 올려도 됩니다.
- `docs/config.js`: 배포 화면의 공유 API 주소 설정.
- `src/App.tsx`: 편집 화면, 터치 반응, 호감도, 표정 타이머.
- `src/styles.css`: 디자인과 모바일 레이아웃.
- `public/config.js`: 다음 빌드에 사용할 API 주소 설정 원본.
- `backend/`: 독립 Cloudflare 공유 API, 이미지 저장·읽기·입력 검증.
- `tests/`: 저장·불러오기·CORS·잘못된 입력 검증 테스트.

기쁨·부끄·화남은 기본 그림과 같은 캔버스 크기와 포즈로 준비하세요.
이전 데이터와의 호환을 위해 **부끄의 내부 키는 `sad`**로 유지합니다. 화면에는 '부끄'로만 표시됩니다.

## 참고 문서

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://vite.dev/guide/static-deploy.html
- https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
- https://developers.cloudflare.com/r2/pricing/

### 이름과 호감도별 랜덤 대사
- 표정에 **당황**, **곤란**이 추가되었습니다. 각 부위의 터치 표정에서 선택하세요.
- 플레이 화면에서 **불러줄 이름**을 입력합니다. 대사에 `{name}`을 쓰면 그 이름으로 부릅니다. 이름을 비우면 `친구`로 표시합니다. 입력한 이름은 공유 저장 데이터에 포함하지 않습니다.
- 기본 대사와 호감도별 대사는 **한 줄에 하나**씩 입력하세요. 같은 부위에서 선택 가능한 대사가 둘 이상이면 직전 대사를 피합니다.
- 호감도 구간은 **0~29 / 30~69 / 70~100**입니다. 터치 직전 점수를 사용하며, 빈 구간은 기본 대사를 사용합니다.
- 기존 작업은 그대로 불러올 수 있습니다. 공유 서버를 사용한다면 새 표정과 대사 저장을 위해 `backend`도 다시 배포하세요.
