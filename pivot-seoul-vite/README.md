# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## 주거 시뮬레이션 화면

흐름: `/onboarding` → `/result?runId=...` → `/scenario?runId=...`.

- `POST /api/simulations`: `{ lifeStage, income, deposit, monthlyRent }` 전송, `{ runId }` 응답을 사용합니다.
- `GET /api/simulations/{runId}/results`: `{ status, rirScore, redZone, keyFactors, scenarios }`를 사용합니다.
- `rirScore`는 백분율 수치(예: `28.5`)이며 `keyFactors`는 문자열 배열로 가정합니다.
- 시나리오 항목: `{ id?, name?, housingCost?, monthlyRent?, rirScore?, redZone? }`. 주거비는 `housingCost`를 우선 표시하고 없으면 `monthlyRent`를 표시합니다.
- 400 필드 오류는 `fieldErrors` 객체 또는 `errors` 객체/배열(`[{ field, message }]`)을 지원합니다.
- 생애단계 선택값은 `YOUTH`, `NEWLYWED`, `GENERAL`, `SENIOR`로 임시 정의했습니다. 실제 서버 enum과 맞춰주세요.
- 월소득은 1원 이상, 보증금과 월세는 0원 이상인 안전한 정수로 검증합니다. 서버의 업무상 상한값은 아직 제공되지 않아 적용하지 않았습니다.

기본 요청 주소는 현재 출처의 `/api`입니다. 별도 백엔드를 사용하는 경우 `.env.example`을 참고하여 `.env.local`에 `VITE_API_BASE_URL`을 지정한 뒤 개발 서버를 재시작하세요. 별도 출처의 서버는 프론트엔드 출처에 대한 CORS 허용이 필요합니다. 실제 서버 응답 계약은 백엔드 연결 시 확인해야 합니다.
